let users = [];

const addUser = ({ name, room, id }) => {
    const exists = users.some(user => user.name === name && user.room === room);
    if (exists) {
        return { error: 'username taken! Try another', user: null }
    }

    const user = { name, id, room }
    users.push(user);
    return { user, error: null }

}

const removeUser = (id) => {
    const exists = users.some(user => user.id === id);

    if (!exists) {
        return { error: 'No user' }
    }
    users = users.filter(user => user.id !== id);
    return users.map(user => user.name);
}

const getRoomUsers = (room) => {
    return users.filter(user => user.room === room).map(user => user.name);
}

const getUser = (id) => {
    return users.filter(user => user.id === id)[0];
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers
}