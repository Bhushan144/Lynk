import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        applicant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // We might also link the recruiter for faster queries
        recruiter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // 📸 SNAPSHOT: Captured at the moment of application
        // If student changes profile resume later, this one stays same.
        resume: {
            type: String, // URL from Cloudinary/Supabase
            required: true
        },

        // 🚦 PIPELINE STATUS
        status: {
            type: String,
            enum: ["APPLIED", "SHORTLISTED", "INTERVIEWING", "REJECTED", "HIRED"],
            default: "APPLIED",
            index: true
        },

        // 🤖 AI INTELLIGENCE (The "Smart" Part)
        matchScore: {
            type: Number,
            default: 0, // 0 to 100
            index: true // Indexed for sorting best candidates first
        },
        aiAnalysis: {
            type: String, // "Strong React skills, missing AWS."
            default: "Pending Analysis..."
        },
        aiProcessingStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

// 🔥 THE IDEMPOTENCY LOCK 🔥
// This Compound Index ensures one student cannot apply to the same job twice.
// MongoDB will throw Error(11000) if they try.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);