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
    let currentRoom = null;

    socket.on('join room', ({ username, roomCode }) => {
        socket.join(roomCode);
        currentRoom = roomCode;
        console.log(`${username} joined room: ${roomCode}`);
        socket.emit('chat message', { username: 'System', message: `Welcome, ${username}!` });
        socket.to(roomCode).emit('chat message', { username: 'System', message: `${username} has joined the room.` });
    });

    socket.on('create room', ({ username, roomCode }) => {
        socket.join(roomCode);
        currentRoom = roomCode;
        console.log(`${username} created room: ${roomCode}`);
        socket.emit('chat message', { username: 'System', message: `Room created. Welcome, ${username}!` });
    });

    socket.on('chat message', ({ username, message }) => {
        if (currentRoom) {
            io.to(currentRoom).emit('chat message', { username, message });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        if (currentRoom) {
            socket.to(currentRoom).emit('chat message', { username: 'System', message: 'A user has left the room.' });
        }
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
