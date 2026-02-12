import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 1. Get all users who have uploaded proof but are pending
const getPendingVerifications = asyncHandler(async (req, res) => {
    
    const pendingUsers = await User.find({
        verificationStatus: "PENDING",
        verificationProof: { $ne: "" } // Only get users who actually uploaded something
    }).select("-password -refreshToken"); // Don't send sensitive data

    return res.status(200).json(
        new ApiResponse(200, pendingUsers, "Pending verifications fetched successfully")
    );
});

// 2. Approve or Reject a User
const verifyUser = asyncHandler(async (req, res) => {
    const { userId, status } = req.body; // status should be "VERIFIED" or "REJECTED"

    if (!userId || !status) {
        throw new ApiError(400, "User ID and Status are required");
    }

    const validStatuses = ["VERIFIED", "REJECTED"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status. Use VERIFIED or REJECTED");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { verificationStatus: status }
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, `User marked as ${status}`)
    );
});

export { getPendingVerifications, verifyUser };