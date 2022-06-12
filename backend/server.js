const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
const userControllers = require('./controllers/userControllers');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    socket.on('join', (data, callback) => {
        const { error, user } = userControllers.addUser({...data, id: socket.id })

        if (error) return callback(error);
        const getUsers = userControllers.getRoomUsers(data.room);
        // console.log(getUsers)
        socket.emit('roomUsers', getUsers)
        socket.broadcast.to(user.room).emit('roomUsers', getUsers)
        socket.emit('message', { user: 'admin', message: `${user.name} joined the chat` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', message: `${user.name} joined the chat` });
        socket.join(data.room);
    })

    socket.on('sendText', (text, callback) => {
        const user = userControllers.getUser(socket.id);
        if (!user) {
            return callback({ error: true, message: 'Youre not connected to a room' })
        } else {
            socket.broadcast.to(user.room).emit('message', { user: user.name, message: text, time: Date.now() });
            socket.emit('message', { user: user.name, message: text, time: Date.now() });
            callback({ error: false })
        }
    })

    socket.on('disconnect', (t) => {
        // userControllers.removeUser(socket.id)
        // const user = userControllers.getUser(socket.id);
        // if (!user) return;
        // socket.broadcast.to(user.room).emit('message', { user: 'admin', message: `${user.name} left`, time: Date.now() });
        // socket.broadcast.to(user.room).emit('roomUsers', userControllers.removeUser(socket.id))
        // console.log('didc', user)
    })
});



httpServer.listen(PORT, () => console.log('server started'));