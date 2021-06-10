const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utls/messages')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utls/users')
const server = http.createServer(app)
const io = socketio(server)
const PORT = 5001

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Dinosaurus Rex'

//Runs when Client is connected
io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
            //Welcome Message
        socket.emit('message', formatMessage(botName, 'Welcome to ChatPro!'))
            //BroadCast when a user connects.
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has joined the Chat.`))

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for Chat Message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
            // io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //Runs when Client Disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('messsage', formatMessage(botName, `${user.username} has left the chat.`))
        }
        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
})



// app.get('/', (req, res) => {
//     res.sendFile('index.html')
// })

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})