const users = []

//User joining a chat
function userJoin(username, room, id) {
    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return user
}

//Getting current user
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

//User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
        users.splice(index, 1)[0]
        return users
    }
}

//Get Room Users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}