const chatForm = document.getElementById('chatform');
/*const chatMessage = document.querySelector('.chat-messages');*/
const chatMessage = document.getElementById('chat-message-list');
const roomName = document.getElementById('navbar-brand');
/*const userList = document.getElementById('users');*/
const userList = document.getElementById('conversation-list');
const userName = document.getElementById('navbarDropdownMenuLink-55');

const { username, room, email} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', {username, room, email});

socket.on('roomUsers', ({ users}) => {
    outputUsers(users);
});

socket.on('loggedInUser', ({ username, gender }) => {
    outputLoggedInUser(username, gender);
    outputRoomName(room);
});

//Run when server sends a message to websocket client
socket.on('message', message => {
    outputMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    /*const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);*/
    if(message.username === username) {
        chatMessage.innerHTML = `<div class="message-row your-message">
        <div class="message-content">
        <div class="message-text"><p class="meta">${message.username} <span style="float: right;">${message.time}</span></p> ${message.text}</div>
        </div>
        </div>` + chatMessage.innerHTML;
    }

    else if(message.username === "WEBChat Admin") {
        chatMessage.innerHTML = `<div class="message-row others-message">
        <div class="message-content">
        <img src="/img/robot.png" style="width: 50px; height: 50px;" alt="avatar image">
        <div class="message-text"><p class="meta">${message.username}<span style="float: right;">${message.time}</span></p> ${message.text}</div>
        </div>
        </div>` + chatMessage.innerHTML;
    }

    else {
        if(message.gender === "Male") {
            chatMessage.innerHTML = `<div class="message-row others-message">
            <div class="message-content">
            <img src="/img/man.png" style="width: 50px; height: 50px;" class="rounded-circle z-depth-0"
            alt="avatar image">
            <div class="message-text"><p class="meta">${message.username}<span style="float: right;">${message.time}</span></p> ${message.text}</div>
            </div>
            </div>` + chatMessage.innerHTML;
        }
        else if(message.gender === "Female") {
            chatMessage.innerHTML = `<div class="message-row others-message">
            <div class="message-content">
            <img src="/img/woman.png" style="width: 50px; height: 50px;" class="rounded-circle z-depth-0"
            alt="avatar image">
            <div class="message-text"><p class="meta">${message.username}<span style="float: right;">${message.time}</span></p> ${message.text}</div>
            </div>
            </div>` + chatMessage.innerHTML;
        }
        else {
            chatMessage.innerHTML = `<div class="message-row others-message">
            <div class="message-content">
            <img src="/img/user.png" style="width: 50px; height: 50px;" class="rounded-circle z-depth-0"
            alt="avatar image">
            <div class="message-text"><p class="meta">${message.username}<span style="float: right;">${message.time}</span></p> ${message.text}</div>
            </div>
            </div>` + chatMessage.innerHTML;
        }
        
    }
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputLoggedInUser(user, gender) {
        if(user === username) {
            if(gender === "Male") {
                userName.innerHTML = `<img src="/img/man.png" style="width: 40px; height: 40px;" class="rounded-circle z-depth-0"
                alt="avatar image">${username}`;
            }
            else if(gender === "Female") {
                userName.innerHTML = `<img src="/img/woman.png" style="width: 40px; height: 40px;" class="rounded-circle z-depth-0"
                alt="avatar image">${username}`;
            }
            else {
                userName.innerHTML = `<img src="/img/user.png" style="width: 40px; height: 40px;" class="rounded-circle z-depth-0"
                alt="avatar image">${username}`;
            }
        }
}

function outputUsers(users) {

    /*userList.innerHTML = `
       ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;*/
          
        userList.innerHTML = users.map(user => {
            if(user.gender === "Male") {
                return `<div class="conversation">
                <img src="/img/man.png" style="width: 45px; height: 45px;" class="rounded-circle z-depth-0"
                alt="avatar image">
                <div id="user-name">
                    ${user.username}
                </div>
                <div id="created-date">
                    ${user.time}
                </div>
                <div class="chat-message">
                    Hey there I am using web chat!! nksnnannanln lnlanlanlsan
                </div>
                </div>`
            }
            else if(user.gender === "Female") {
                return `<div class="conversation">
                <img src="/img/woman.png" style="width: 40px; height: 40px;" class="rounded-circle z-depth-0"
                alt="avatar image">
                <div id="user-name">
                    ${user.username}
                </div>
                <div id="created-date">
                    ${user.time}
                </div>
                <div class="chat-message">
                    Hey there I am using web chat!! nksnnannanln lnlanlanlsan
                </div>
                </div>`
            }
            else {
                return `<div class="conversation">
                <img src="/img/user.png" style="width: 40px; height: 40px;" class="rounded-circle z-depth-0"
                alt="avatar image">
                <div id="user-name">
                    ${user.username}
                </div>
                <div id="created-date">
                    ${user.time}
                </div>
                <div class="chat-message">
                    Hey there I am using web chat!! nksnnannanln lnlanlanlsan
                </div>
                </div>`
            }
        }
               
        ).join('')
           
}
