const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
    origin: "https://chatappreact-three.vercel.app", // Frontend URL
    methods: ["GET", "POST", "PUT"],
    credentials: true,
}));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello');
});

// Use environment variable for port or fallback to 8081
const PORT = process.env.PORT || 8081;

// Create HTTP server and attach socket.io to it
const server = http.createServer(app);

// Create a new instance of socket.io and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: "https://chatappreact-three.vercel.app", // Your frontend URL
        methods: ["GET", "POST"],
        credentials: true, // Allows credentials (important for cross-origin cookies/auth)
    },
});


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("join_room", (room) => {
        console.log(`User ID: ${socket.id} trying to join room: ${room}`);
        socket.join(room);
    });

    socket.on("send_message", (data) => {
        console.log("Message received: ", data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
