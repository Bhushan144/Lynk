import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN, // Matches your frontend URL
        methods: ["GET", "POST"]
    }
});

// Store online users: { userId: socketId }
// Example: { "65a123...": "socket_abc123" }
const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    // 1. Get userId from Frontend connection request
    const userId = socket.handshake.query.userId;

    // Add check to ensure userId is not "null" string
    if (userId && userId !== "undefined" && userId !== "null") {
        userSocketMap[userId] = socket.id;
    }

    // 2. Broadcast online status to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // 3. Handle Disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };