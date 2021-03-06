const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 5000;
const userControllers = require("./controllers/userControllers");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    socket.on("join", (data, callback) => {
        const { error, user } = userControllers.addUser({...data, id: socket.id });

        if (error) return callback(error);
        const usersInRoom = userControllers.getRoomUsers(data.room);
        socket.emit("roomUsers", usersInRoom);
        socket.broadcast.to(user.room).emit("roomUsers", usersInRoom);
        socket.emit("message", {
            user: "admin",
            message: `You joined the chat`,
        });
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            message: `${user.name} joined the chat`,
        });
        socket.join(data.room);
    });

    socket.on("sendText", (text, callback) => {
        const user = userControllers.getUser(socket.id);
        if (!user) {
            return callback({
                error: true,
                message: "You're not connected to a room",
            });
        } else {
            socket.broadcast
                .to(user.room)
                .emit("message", { user: user.name, message: text, time: Date.now() });
            socket.emit("message", {
                user: user.name,
                message: text,
                time: Date.now(),
            });
            callback({ error: false });
        }
    });

    socket.on("disconnect", (t) => {
        const user = userControllers.getUser(socket.id);
        if (!user) return;
        const remUsers = userControllers.removeUser(socket.id);
        if (!remUsers.length) return;
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            message: `${user.name} left`,
            time: Date.now(),
        });
        socket.broadcast.to(user.room).emit("roomUsers", remUsers);
    });
});

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});
app.get('*', (req, res) => res.sendFile(path.join(__dirname, "views", "404.html")));
httpServer.listen(PORT, () => console.log("server started"));