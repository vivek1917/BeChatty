// import express from "express";
// import { createServer } from 'node:http';
// import { fileURLToPath } from "node:url";
// import { dirname, join } from "node:path";
// import { Server } from "socket.io";

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// const __dirname = dirname(fileURLToPath(import.meta.url));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//         //console.log('message: ' + msg);
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

// server.listen(3000, () => {
//     console.log('server running at http://localhost:3000');
// });

//2nd code:

import express from "express";
import { createServer } from 'node:http';
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Store the room code in the socket object
    let currentRoom = null;

    // Join a room
    socket.on('join room', (roomCode) => {
        socket.join(roomCode);
        currentRoom = roomCode;
        console.log(`User joined room: ${roomCode}`);
        socket.emit('chat message', `You have joined room: ${roomCode}`);
    });

    // Create a room
    socket.on('create room', (roomCode) => {
        socket.join(roomCode);
        currentRoom = roomCode;
        console.log(`Room created: ${roomCode}`);
        socket.emit('chat message', `Room created: ${roomCode}`);
    });

    // Handle chat message
    socket.on('chat message', (msg) => {
        if (currentRoom) {
            io.to(currentRoom).emit('chat message', msg); // Emit to the specific room
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
