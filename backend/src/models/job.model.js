import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true // Index for search
        },
        description: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true // e.g., "Pune, India" or "Remote"
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
            required: true
        },
        workMode: {
            type: String,
            enum: ["On-site", "Remote", "Hybrid"],
            default: "On-site"
        },
        salaryRange: {
            type: String, 
            default: "Not disclosed" // e.g., "10LPA - 15LPA"
        },
        
        // 🔥 CRITICAL FOR AI MATCHING 🔥
        requiredSkills: [{
            type: String,
            trim: true,
            lowercase: true // Normalizes "React" and "react"
        }],

        // Relationships
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // 🔄 LIFECYCLE MANAGEMENT
        status: {
            type: String,
            enum: ["OPEN", "CLOSED", "PAUSED"],
            default: "OPEN",
            index: true
        },
        expiresAt: {
            type: Date,
            default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // Default 30 Days
        },

        // 📊 ANALYTICS (Lightweight Counters)
        views: {
            type: Number,
            default: 0
        },
        applicantCount: {
            type: Number,
            default: 0
        },
        
        // 🛡️ MODERATION
        isFlagged: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Auto-close expired jobs logic can be handled in controller or a cron job later.
export const Job = mongoose.model("Job", jobSchema);