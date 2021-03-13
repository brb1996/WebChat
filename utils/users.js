const users = [];
const bcrypt = require('bcrypt');

function userJoin(id, username, room, email, gender) {
    const user = {id, username, room, email, gender};
    users.push(user);
    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

//function to generate salt for hashing password
function generateSalt(salt, callback) {
    bcrypt.genSalt(salt, function(err, salt){
    if(err) callback(err);
    callback(salt);
    })
}

//function to hash plain text password
function hashPassword(password, salt, callback) {
    bcrypt.hash(password, salt, function (err, hash) {
        if(err) callback(err);
        callback(hash);    
    })
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    generateSalt,
    hashPassword
};