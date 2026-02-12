import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const updateVerificationDetails = asyncHandler(async (req, res) => {
    // 1. Check if file is missing 
    const localFilePath = req.file?.path;
    if (!localFilePath) {
        throw new ApiError(400, "Verification proof file is required");
    }

    // 2. Security Check: Only block if already verified
    // We REMOVED the check for 'PENDING'. 
    // This allows users to re-upload if they made a mistake, or upload for the first time.
    if (req.user.verificationStatus === 'VERIFIED') {
        throw new ApiError(400, "You are already verified! No need to resubmit.");
    }

    // 3. Upload on Cloudinary
    const proofImage = await uploadOnCloudinary(localFilePath);
    if (!proofImage) {
        throw new ApiError(500, "Error uploading file to cloud storage");
    }

    // 4. Update user in DB
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                verificationStatus: "PENDING",  // Always set to Pending so Admin sees it in their queue
                verificationProof: proofImage.url // Overwrite previous proof if it exists
            }
        },
        { new: true } 
    ).select("-refreshToken -password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Verification proof submitted successfully"));
});

export { updateVerificationDetails };