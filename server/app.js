const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
    origin: "*", // You can replace "*" with your frontend URL if you want to limit access
    methods: ["GET", "POST"],
    credentials: true, // Set this to true if you're handling credentials (cookies, auth headers)
}));

// Basic test route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Use environment variable for port or fallback to 8081
const PORT = process.env.PORT || 8081;

// Create HTTP server and attach socket.io to it
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatappreact-three.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],  // Allow WebSocket and polling transports
});

// Socket.IO event handling
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a room
    socket.on("join_room", (room) => {
        console.log(`User ID: ${socket.id} joined room: ${room}`);
        socket.join(room);  // Join the specified room
    });

    // Handle receiving and broadcasting messages
    socket.on("send_message", (data) => {
        console.log("Message received:", data);
        socket.to(data.room).emit("receive_message", data);  // Broadcast message to others in the room
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server and listen on the defined port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
