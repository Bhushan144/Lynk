import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // --- CONNECTION REQUEST LOGIC ---
        initiator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        requestMessage: {
            type: String,
            trim: true,
            default: "", 
        },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
        },

        // --- CHAT & BADGE LOGIC ---
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
        // Stores unread counts: { "userId1": 0, "userId2": 5 }
        unreadCounts: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

// Index for instant sidebar loading
conversationSchema.index({ participants: 1, updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);