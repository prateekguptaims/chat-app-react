const express = require('express');
const { Server } = require('socket.io'); // Correct import of socket.io
const http = require('http'); // Required to create the server for socket.io
const bodyParser = require('body-parser');
const cors = require('cors');
// require('dotenv').config();

const app = express();

app.use(bodyParser.json()); // To parse JSON requests
app.use(cors()); // To enable CORS

app.get('/', (req, res) => {
    res.send('Hello');
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://chatappreact-three.vercel.app/", 
        methods: ["GET","POST","PUT"]
    }
});

io.on("connection",(socket)=>{console.log(socket.id)

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`User ID :- ${socket.id} joined room : ${data}`)
    })

    socket.on("send_message",(data)=>{console.log("send message data ",data)
    socket.to(data.room).emit("receive_message",data)
})

    socket.on("disconnect",()=>{
        console.log("User Disconnected..",socket.id)
    })
});


// const PORT = process.env.port || 8080;

const PORT = 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
