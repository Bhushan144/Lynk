import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

import { getReceiverSocketId, io } from "../socket.js";
import mailSender from "../utils/mailSender.js";


// 1. Send Connection Request
const sendConnectionRequest = asyncHandler(async (req, res) => {
    const { receiverId, requestMessage } = req.body;

    if (!receiverId) throw new ApiError(400, "Receiver ID is required");
    if (req.user._id.toString() === receiverId) throw new ApiError(400, "Cannot connect with self");

    // Check existing
    const existingConversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] }
    });

    if (existingConversation) {
        if (existingConversation.status === "REJECTED") {
            // Retry logic
            existingConversation.status = "PENDING";
            existingConversation.requestMessage = requestMessage || "";
            existingConversation.initiator = req.user._id;
            await existingConversation.save();
            return res.status(200).json(new ApiResponse(200, existingConversation, "Request resent"));
        }
        if (existingConversation.status === "PENDING") throw new ApiError(400, "Request already pending");
        if (existingConversation.status === "ACCEPTED") throw new ApiError(400, "Already connected");
    }

    // Create New (Initialize unreadCounts to 0)
    const newConversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        initiator: req.user._id,
        requestMessage: requestMessage || "",
        status: "PENDING",
        unreadCounts: {
            [req.user._id]: 0,
            [receiverId]: 0
        }
    });

    // Email Notification
    const receiver = await User.findById(receiverId).select("email fullName");
    if (receiver) {
        const emailTitle = `New Connection Request from ${req.user.fullName}`;
        const emailBody = `
            <h3>Hello ${receiver.fullName},</h3>
            <p><strong>${req.user.fullName}</strong> wants to connect.</p>
            <p>Note: "${requestMessage || 'No message'}"</p>
        `;
        mailSender(receiver.email, emailTitle, emailBody).catch(err => console.log("Mail Error:", err));
    }

    // Socket Notification for Request
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newRequest", {
            senderName: req.user.fullName,
            conversationId: newConversation._id
        });
    }

    return res.status(201).json(new ApiResponse(201, newConversation, "Request sent"));
});


// 2. Accept/Reject Request
const handleRequest = asyncHandler(async (req, res) => {
    const { conversationId, action } = req.body; // ACCEPTED / REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(action)) throw new ApiError(400, "Invalid action");

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, "Request not found");
    
    // Only Receiver can accept
    if (conversation.initiator.toString() === req.user._id.toString()) {
        throw new ApiError(403, "Cannot accept own request");
    }

    conversation.status = action;
    
    // If Accepted, ensure unreadCounts map exists
    if (action === "ACCEPTED" && !conversation.unreadCounts) {
        conversation.unreadCounts = {
            [conversation.participants[0]]: 0,
            [conversation.participants[1]]: 0
        };
    }
    
    await conversation.save();

    // Email & Socket if Accepted
    if (action === "ACCEPTED") {
        const sender = await User.findById(conversation.initiator).select("email fullName");
        if (sender) {
            mailSender(sender.email, "Request Accepted!", `<h3>${req.user.fullName} accepted your request.</h3>`)
                .catch(e => console.log(e));
        }
        
        // Notify Sender via Socket so their UI updates
        const senderSocketId = getReceiverSocketId(conversation.initiator.toString());
        if (senderSocketId) {
            io.to(senderSocketId).emit("requestAccepted", { 
                conversationId: conversation._id,
                accepterName: req.user.fullName
            });
        }
    }

    return res.status(200).json(new ApiResponse(200, conversation, `Request ${action}`));
});


// 3. Send Message
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, content } = req.body;

    if (!content) throw new ApiError(400, "Content required");

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");
    if (conversation.status !== "ACCEPTED") throw new ApiError(403, "Must be connected to chat");

    // 1. Create Message
    const newMessage = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content
    });

    // 2. Update Conversation (Last Message + Unread Count)
    const receiverId = conversation.participants.find(
        id => id.toString() !== req.user._id.toString()
    );

    conversation.lastMessage = newMessage._id;
    
    // Increment ONLY the Receiver's Unread Count
    const currentCount = conversation.unreadCounts.get(receiverId.toString()) || 0;
    conversation.unreadCounts.set(receiverId.toString(), currentCount + 1);
    
    await conversation.save();

    // 3. 🔥 Socket Event - ONLY to RECEIVER (sender has optimistic update)
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        console.log(`✅ [SOCKET] Message sent to receiver (${receiverId})`);
    }

    return res.status(201).json(new ApiResponse(201, newMessage, "Message sent"));
});


// 4. Get My Requests (Unchanged logic, just cleanup)
const getMyRequests = asyncHandler(async(req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
        participants: { $in: [req.user._id] },
        initiator: { $ne: req.user._id }, 
        status: "PENDING"
    };

    const requests = await Conversation.find(filter)
        .populate("initiator", "fullName avatar username collegeName currentCompany")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalRequests = await Conversation.countDocuments(filter);

    return res.status(200).json(new ApiResponse(200, { requests, totalRequests }, "Requests fetched"));
});


// 5. Get My Chats (UPDATED: Return Unread Count)
const getMyChats = asyncHandler(async(req, res) => {
    const { page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
        participants: { $in: [req.user._id] },
        status: "ACCEPTED"
    };

    const conversations = await Conversation.find(filter)
        .populate("participants", "fullName avatar username")
        .populate("lastMessage") 
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalChats = await Conversation.countDocuments(filter);

    // Transform Data for Frontend
    const chats = conversations.map(chat => {
        // Find the "Other" user
        const partner = chat.participants.find(
            p => p._id.toString() !== req.user._id.toString()
        );
        
        return {
            _id: chat._id,
            partner,
            lastMessage: chat.lastMessage,
            // RETURN MY UNREAD COUNT
            unreadCount: chat.unreadCounts?.get(req.user._id.toString()) || 0,
            updatedAt: chat.updatedAt
        };
    });

    return res.status(200).json(new ApiResponse(200, { chats, totalChats }, "Chats fetched"));
});


// 6. Get Messages (UPDATED: Mark Read + Reset Count)
const getMessages = asyncHandler(async(req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query; 
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 1. Fetch Messages
    const messages = await Message.find({ conversation: conversationId }) // matched new schema
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(parseInt(limit));

    // 2. LOGIC: If looking at page 1 (most recent), Mark as Read
    if (parseInt(page) === 1) {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            // Reset My Badge to 0
            conversation.unreadCounts.set(req.user._id.toString(), 0);
            await conversation.save();
        }
        
        // Optional: Mark actual messages as read (for Blue Ticks)
        // Only mark incoming messages as read
        await Message.updateMany(
            { conversation: conversationId, sender: { $ne: req.user._id }, isRead: false },
            { $set: { isRead: true } }
        );
    }

    return res.status(200).json(new ApiResponse(200, messages.reverse(), "Messages fetched"));
});

export {
    sendConnectionRequest,
    handleRequest,
    sendMessage,
    getMyRequests,
    getMyChats,
    getMessages
};