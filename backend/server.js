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
    console.log('connected', socket.id);
    socket.on('join', (data, callback) => {
        const { error, user } = userControllers.addUser({...data, id: socket.id })

        if (error) return callback(error);

        socket.emit('message', { user: 'admin', message: `${user.name} joined` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', message: `${user.name} joined` });
        socket.join(data.room);
    })

    socket.on('sendText', (text, callback) => {
        const user = userControllers.getUser(socket.id);
        if (!user.room) {
            return console.log(user)
        } else {
            socket.broadcast.to(user.room).emit('message', { name: user.name, message: text });
            socket.emit('message', { user: user.name, message: text });
            console.log(text)
            callback()
        }
    })

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
});



httpServer.listen(PORT, () => console.log('server started'));