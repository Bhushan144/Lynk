import mongoose, { Schema } from "mongoose";

let profileSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    // Social Identity 
    bio: {
        type: String,
        maxLength: 300,
        default: ""
    },
    skills: [
        {
            type: String,
            trim: true
        }
    ],

    // --- NEW FIELD: Resume ---
    resume: {
        type: String, // Stores Cloudinary URL (PDF)
        default: ""
    },
    banner: {
        type: String,
        default: "" // We will handle the "default gradient" in the Frontend if this is empty
    },

    // Privacy and contact 
    mobileNumber: {
        type: String,
        default: ""
    },
    isMobileVisible: {
        type: Boolean,
        default: false
    },
    isProfilePublic: {
        type: Boolean,
        default: true
    },

    // Student specific 
    collegeName: {
        type: String,
        default: process.env.COLLEGE_NAME || "Vishawakarma Institute of Technology"
    },
    batchYear: {
        type: Number
    },

    // Alumni specific 
    currentCompany: {
        type: String,
        default: ""
    },
    currentRole: {
        type: String,
        default: ""
    },

    // Experience Logic
    experience: [
        {
            company: { type: String, required: true },
            role: { type: String, required: true },
            startDate: { type: Date },
            endDate: { type: Date },
            current: { type: Boolean, default: false }
        }
    ],

    // External links 
    socialLinks: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        leetcode: { type: String, default: "" }, // <--- Added LeetCode
        portfolio: { type: String, default: "" }
    }
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export { Profile };