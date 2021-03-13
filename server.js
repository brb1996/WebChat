const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server  = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, generateSalt, hashPassword} = require('./utils/users');
const { isMaster } = require('cluster');
const index = require('./routes/index');
const users = require('./routes/users');
const expressLayouts = require('express-ejs-layouts');
const chatBot = 'WEBChat Admin';

//connection to mongoDB database (mlab database)
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://webchat_admin:ouBlIgFDbH1W0b5w@webchat-cluster-0.7ubhq.mongodb.net/web_chat?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true  })
.then(() => console.log("DB Connected successfully"))
.catch(error => console.log(error));

//importing mongoDB user authentication model
User = require('./models/user')

app.use(bodyParser.json());

//set route redirect paths
app.use('/', index);
app.use('/users', users);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

const user = new User();

//posting user signup data to database
app.post('/api/user/signup', (req, res) => {
    
    User.findOne({'email': req.body.email}, (err, email) => {
        if(email) res.status(401).send('Signup failed, Email ID already present!');
          
        else {
            const user_data = new User ({
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
            password: req.body.password
            })
            .save((err, response) => {
            if(err) res.status(400).send('Error occured as follows :' +err)
            res.status(200).send('User account '+req.body.email+ ' has been successfully registered!')
            })
        }
    })
    
});

//Reset user password
app.post('/api/user/passwordreset', (req, res) => {
    let SALT = 10;
    generateSalt(SALT, function(salt) {
    
        hashPassword(req.body.password, salt, function(hashedPassword){
        
            User.updateOne({'email': req.body.email}, {'password': hashedPassword}, (err, user) => {
                if(err) 
                    res.status(401).send('Sorry, we couldn\'t reset password as the EmailID associated with the account was not found!')
            
                else {
                    res.status(200).send('Password reset was successful for account ' + req.body.email);
                }
            })
        })
    })    
});

 //Pre checks for web chat login
app.post('/api/user/signin', (req, res)=> {
    //checks whether emailID already present in DB or not
    User.findOne({'email': req.body.email, 'name': req.body.name}, (err, user) => {
        
        if(!user) res.status(401).send('Invalid Email address or username!')
       
        //comparing password if emailID entered is valid and present in DB
        else
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(err) throw err;
            if(!isMatch) return res.status(401).send('Invalid password entered!');
            res.status(200).send('Logged in Successfully')
        })
    })
});

//set current directory as static root web folder 
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {
    
    socket.on('joinRoom', ({username, room, email}) => {
       
        User.findOne({'email': email, 'name': username}, (err, loggedInUser) => {
    
            if(err);

            else {
                    const user = userJoin(socket.id, username, room, email, loggedInUser.gender);

                    socket.emit('loggedInUser', { 
                        username: user.username,
                        room: user.room,
                        gender: user.gender
                    });

                    socket.join(user.room);
              
                    //Run when new client connects and sends this message only to the joined client
                    socket.emit('message', formatMessage(chatBot, 'Welcome to WEBChat ! Have a nice day chatting....'));
        
                    //Run when new client connects and broadcasted to all in the current room
                    socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the room`));
            
                    io.to(user.room).emit('roomUsers', {
                        users: getRoomUsers(user.room)
                    });
        
            }
        });
    
    });
      
    //Run when client sends message
    socket.on('chatMessage', msg => {

        //Get ID of the user who sends the message 
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg, user.gender));
    });

    //Run when client disconnects
    socket.on('disconnect', () => {

        //Get user name who has left the chat
        const user = userLeave(socket.id);
        if(user) { 
        io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
        }
    });
});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));