import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Message } from "./models/message.model.js";
import { Conversation } from "./models/conversation.model.js";

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

    // 3. 🔥 Handle "markAsRead" - When receiver is viewing a chat and receives a message
    socket.on("markAsRead", async ({ conversationId }) => {
        if (!userId || !conversationId) return;

        try {
            // Find who the sender is (the other participant)
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) return;

            const senderId = conversation.participants.find(
                id => id.toString() !== userId
            );

            // Mark unread messages from the sender as read
            const result = await Message.updateMany(
                { conversation: conversationId, sender: { $ne: userId }, isRead: false },
                { $set: { isRead: true } }
            );

            // Reset unread count for this user
            if (conversation.unreadCounts) {
                conversation.unreadCounts.set(userId, 0);
                await conversation.save();
            }

            // Notify the sender so their blue ticks update
            if (result.modifiedCount > 0 && senderId) {
                const senderSocketId = userSocketMap[senderId.toString()];
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messagesRead", {
                        conversationId: conversationId.toString(),
                        readBy: userId
                    });
                    console.log(`✅ [SOCKET] Blue tick: Notified sender (${senderId}) - ${result.modifiedCount} messages marked read`);
                }
            }
        } catch (err) {
            console.error("❌ markAsRead error:", err.message);
        }
    });

    // 4. Handle Disconnect
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };