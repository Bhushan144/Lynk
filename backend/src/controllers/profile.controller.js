import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Profile } from "../models/profile.model.js"
import { uploadToSupabase } from "../utils/supabase.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// 1.GET : Fetch current users's profile
const getMyProfile = asyncHandler(async (req, res) => {

    // Find profile linked to the logged-in user
    const profile = await Profile.findOne({ owner: req.user._id }).populate("owner", "username email fullName avatar role verificationStatus verificationProof")

    if (!profile) {
        throw new ApiError(404, "profile not found");
    }

    res
        .status(200)
        .json(new ApiResponse(
            200,
            profile,
            "Profile fetched successfully"
        ))
})

// 2. PATCH : Update profile details 
const updateProfile = asyncHandler(async (req, res) => {
    const {
        bio,
        skills,
        mobileNumber,
        isMobileVisible,
        isProfilePublic,
        collegeName,
        batchYear,
        currentCompany,
        currentRole,
        experience,
        socialLinks // Expecting object { linkedin, github, leetcode, portfolio }
    } = req.body;

    const profile = await Profile.findOne({ owner: req.user._id });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    // --- Update Direct Fields ---
    // We use (value !== undefined) check so we don't accidentally wipe data if frontend sends null
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (mobileNumber !== undefined) profile.mobileNumber = mobileNumber;
    if (isMobileVisible !== undefined) profile.isMobileVisible = isMobileVisible;
    if (isProfilePublic !== undefined) profile.isProfilePublic = isProfilePublic;

    if (collegeName !== undefined) profile.collegeName = collegeName;
    if (batchYear !== undefined) profile.batchYear = batchYear;

    if (currentCompany !== undefined) profile.currentCompany = currentCompany;
    if (currentRole !== undefined) profile.currentRole = currentRole;
    if (experience !== undefined) profile.experience = experience;

    // --- Update Social Links (Merge Logic) ---
    // This ensures if you only send "leetcode", you don't lose "linkedin"
    if (socialLinks) {
        profile.socialLinks = {
            linkedin: socialLinks.linkedin || profile.socialLinks.linkedin,
            github: socialLinks.github || profile.socialLinks.github,
            portfolio: socialLinks.portfolio || profile.socialLinks.portfolio,
            leetcode: socialLinks.leetcode || profile.socialLinks.leetcode, // <--- Added LeetCode
        };
    }

    await profile.save();

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Profile updated successfully"));
});

// 3. GET : public feed with search and filters
const getAllProfiles = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    // User must be verified
    if (req.user.verificationStatus !== "VERIFIED") {
        throw new ApiError(404, "Access Denied: you must be verified to view the Alumni Directory")
    }

    //convert page/limit to numbers 
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber - 1) * limitNumber;

    //The aggrigation pipeline 
    const pipeline = [
        {
            $match: {
                owner: { $ne: req.user._id }
            }
        },

        //1. join with users collection to get the name , avatar and role
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        //2. Unwind the array (since lookup returns an array ) :- means convert userDetails array to normal object 
        {
            $unwind: "$userDetails"
        },
        //3. Initial filters : only verified public profile
        {
            $match: {
                "userDetails.verificationStatus": "VERIFIED",
                "userDetails.role": "ALUMNI",
                "isProfilePublic": true
            }
        }
    ];

    //4. dynamic filters
    //filter by search (eg. ?search=google)
    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { "userDetails.fullName": { $regex: search, $options: "i" } }, //case insensitive
                    { "currentCompany": { $regex: search, $options: "i" } },
                    { "skills": { $regex: search, $options: "i" } }
                ]
            }
        });
    };


    //5. pagination and projection
    pipeline.push(
        {
            // facet lets you run multiple aggregation pipelines in parallel on the same data, in our api we need two things : 1.actual data and 2.count
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: skip },
                    { $limit: limitNumber },
                    {
                        $project: {
                            _id: 1,
                            owner: 1,
                            bio: 1,
                            skills: 1,
                            currentCompany: 1,
                            currentRole: 1,
                            collegeName: 1,
                            batchYear: 1,
                            experience: 1,
                            socialLinks: 1,

                            //flatten user details
                            fullName: "$userDetails.fullName",
                            avatar: "$userDetails.avatar",
                            role: "$userDetails.role",
                            verificationStatus: "$userDetails.verificationStatus",

                            //privacy logic : conditional phone number 
                            mobileNumber: {
                                $cond: {
                                    if: { $eq: ["$isMobileVisible", true] },
                                    then: "$mobileNumber",
                                    else: "$$REMOVE" //Remove fields if false 
                                }
                            }
                        }
                    }
                ]
            }
        }
    );

    const result = await Profile.aggregate(pipeline)

    //format the response 
    const data = result[0].data;
    const total = result[0].metadata[0]?.total || 0;

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                profiles: data,
                total,
                page: pageNumber,
                totalPages: Math.ceil(total / limitNumber)
            },
            "Profiles fetched succesfully"
        ))
})

// 4. GET: Fetch specific profile by ID (Public View)
const getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Try to find by profile document ID first
    let profile = await Profile.findById(id).populate("owner", "fullName username avatar role email");

    // If not found, assume it's a user ID and search by owner field
    if (!profile) {
        profile = await Profile.findOne({ owner: id }).populate("owner", "fullName username avatar role email");
    }

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
});


const uploadResume = asyncHandler(async (req, res) => {
    // --- DEBUG LOGS ---
    console.log("📥 Upload Resume Request Received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // 1. Check if file exists (Multer puts it in req.file)
    const resumeLocalPath = req.file?.path;
    const originalName = req.file?.originalname;

    if (!resumeLocalPath) {
        throw new ApiError(400, "Resume file is required");
    }

    // 2. Upload to Supabase Storage
    const resume = await uploadToSupabase(resumeLocalPath, originalName);

    if (!resume?.url) {
        throw new ApiError(500, "Failed to upload resume to cloud storage");
    }

    // 3. Update the Profile in DB with the new public URL
    const profile = await Profile.findOneAndUpdate(
        { owner: req.user._id },
        {
            $set: {
                resume: resume.url
            }
        },
        { new: true } // Return the updated document
    );

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Resume uploaded successfully"));
});

const updateBanner = asyncHandler(async (req, res) => {
    // 1. Check file
    const bannerLocalPath = req.file?.path;
    if (!bannerLocalPath) {
        throw new ApiError(400, "Banner file is missing");
    }

    // 2. Upload to Cloudinary
    const banner = await uploadOnCloudinary(bannerLocalPath);

    if (!banner?.url) {
        throw new ApiError(500, "Failed to upload banner");
    }

    // 3. Update DB
    const profile = await Profile.findOneAndUpdate(
        { owner: req.user._id },
        { $set: { banner: banner.url } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, profile, "Banner updated successfully"));
});

export { getMyProfile, updateProfile, getAllProfiles, getUserProfile, uploadResume, uploadToSupabase ,updateBanner};




/*
1. simple visual for pipeline :
profiles
   ↓
$lookup
   ↓
$match (verified, public)
   ↓
$facet
   ├── metadata pipeline → count
   └── data pipeline     → paginated results


2. final output will look like this 
[
    {
  metadata: [{ total: 37 }],
  data: [
    { profile1 },
    { profile2 },
    ...
  ]
}
]

*/