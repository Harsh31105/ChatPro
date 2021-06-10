const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get Username and Room from URL
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

//Join Chat Room
socket.emit('joinRoom', {
    username,
    room
})

//Get Room and Users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

//Message from Server
socket.on('message', (message) => {
    console.log(message)
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
        //Getting Text in Message
    let msg = e.target.elements.msg.value
    msg = msg.trim()
    if (!msg) {
        return false
    }
    //Emit message to Server
    socket.emit('chatMessage', msg)
        //Clear Input Box
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outputRoomName(room) {
    roomName.innerText = room
}

function outputUsers(users) {
    userList.innerHTML = ''
    users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username;
        userList.appendChild(li)
    })
}

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    const p = document.createElement('p')
    p.classList.add('meta')
    p.innerText = message.username
    p.innerHTML += `<span>${message.time}</span>`
    div.appendChild(p)
    const para = document.createElement('p')
    para.classList.add('text')
    para.innerText = message.innerText
    div.appendChild(para)
    document.querySelector('.chat-messages').appendChild(div)
}

//Prompt user before leaving the Chat Room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the Chat Room?')
    if (leaveRoom) {
        window.location = '../index.html'
    }
})