const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Simple route
app.get('/', (req, res) => {
    res.send('Hello');
});

const PORT = 8081;

// Create HTTP server and attach socket.io to it
const server = http.createServer(app);

// Create a new instance of socket.io and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "https://chatappreact-three.vercel.app", // Replace with your frontend URL
        methods: ["GET", "POST", "PUT"],
    },
});

// Handling Socket.IO events
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        console.log("Message data: ", data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
