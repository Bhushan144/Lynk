import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from '../models/user.model.js';
import { Profile } from '../models/profile.model.js';

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, fullName, role } = req.body;

    // Validation
    if ([email, username, password, fullName, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedRole = role.toUpperCase();

    if (!["STUDENT", "ALUMNI"].includes(normalizedRole)) {
        throw new ApiError(400, "Invalid Role");
    }

    // Check if user exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Create User (Status is UNVERIFIED by default from Schema)
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        role,
        // No avatar/proof required at this stage
    });

    // Create Empty Profile linked to this user
    await Profile.create({ owner: user._id });

    // Remove password from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Auto-Login (Generate tokens immediately)
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: createdUser, accessToken, refreshToken }, "User registered Successfully")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    //find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    //check if password is correcct 
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-refreshToken -password");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged In successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const id = req.user._id;
    await User.findByIdAndUpdate(id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "user logged out successfully"
            )
        )
})

//helper to generate access token and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}


const updateUserAvatar = asyncHandler(async (req, res) => {
    // 1. Check if file exists from Multer
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // 2. Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    // 3. Update User Document
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true } // Return the updated document
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // 1. Validate inputs
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    // 2. Get user from DB (req.user is set by verifyJWT middleware)
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3. Verify the Old Password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }

    // 4. Update and Save
    // We update the field directly so the 'pre-save' hook in your User model fires and hashes it
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});


//-------------------------------------------------------------------------------------


// --- TEMPORARY SEED FUNCTION ---

const seedDatabase = asyncHandler(async (req, res) => {
    // 1. The Dummy Data
    const dummies = [
        {
            fullName: "Rahul Sharma",
            email: "rahul.sde@google.com",
            username: "rahul_dev",
            password: "password123",
            role: "ALUMNI",
            bio: "Senior Software Engineer at Google. Passionate about distributed systems and helping juniors.",
            skills: ["Java", "System Design", "Kubernetes", "GCP"],
            collegeName: "VIIT Pune",
            currentCompany: "Google",
            currentRole: "Senior SDE",
            experience: [
                { role: "Senior SDE", company: "Google", startDate: "2023-01-01", current: true },
                { role: "SDE II", company: "Amazon", startDate: "2020-06-01", endDate: "2022-12-31", current: false }
            ]
        },
        {
            fullName: "Priya Patel",
            email: "priya.pm@microsoft.com",
            username: "priya_pm",
            password: "password123",
            role: "ALUMNI",
            bio: "Product Manager at Microsoft. I love bridging the gap between engineering and business.",
            skills: ["Product Management", "Agile", "Azure", "Python"],
            collegeName: "VIIT Pune",
            currentCompany: "Microsoft",
            currentRole: "Product Manager",
            experience: [
                { role: "Product Manager", company: "Microsoft", startDate: "2022-03-01", current: true },
                { role: "Business Analyst", company: "Deloitte", startDate: "2019-07-01", endDate: "2022-02-28", current: false }
            ]
        },
        {
            fullName: "Amit Verma",
            email: "amit.data@netflix.com",
            username: "amit_ai",
            password: "password123",
            role: "ALUMNI",
            bio: "Data Scientist working on recommendation algorithms. Ask me about AI/ML!",
            skills: ["Machine Learning", "TensorFlow", "Python", "Big Data"],
            collegeName: "VIIT Pune",
            currentCompany: "Netflix",
            currentRole: "Data Scientist",
            experience: [
                { role: "Data Scientist", company: "Netflix", startDate: "2021-08-01", current: true },
                { role: "ML Engineer", company: "Zomato", startDate: "2018-05-01", endDate: "2021-07-31", current: false }
            ]
        },
        {
            fullName: "Sneha Gupta",
            email: "sneha.devops@redhat.com",
            username: "sneha_ops",
            password: "password123",
            role: "ALUMNI",
            bio: "DevOps Engineer ensuring 99.99% uptime. Linux enthusiast.",
            skills: ["Docker", "Jenkins", "Linux", "AWS"],
            collegeName: "VIIT Pune",
            currentCompany: "Red Hat",
            currentRole: "DevOps Engineer",
            experience: [
                { role: "DevOps Engineer", company: "Red Hat", startDate: "2022-01-01", current: true }
            ]
        }
    ];

    // 2. Loop and Create
    for (const d of dummies) {
        // Check if exists
        const exists = await User.findOne({ email: d.email });
        if (exists) continue;

        // Create User
        const user = await User.create({
            fullName: d.fullName,
            email: d.email,
            username: d.username,
            password: d.password, // This will be hashed automatically by your User model logic
            role: d.role,
            verificationStatus: "VERIFIED"
        });

        // Create Profile
        await Profile.create({
            owner: user._id,
            bio: d.bio,
            skills: d.skills,
            collegeName: d.collegeName,
            currentCompany: d.currentCompany,
            currentRole: d.currentRole,
            experience: d.experience,
            isProfilePublic: true,
            isMobileVisible: true,
            mobileNumber: "9876543210",
            socialLinks: { linkedin: "linkedin.com", github: "github.com" }
        });
    }

    res.status(200).json({ message: "Dummy users created successfully!" });
});



export { registerUser, loginUser, logoutUser, generateAccessAndRefreshTokens, updateUserAvatar, seedDatabase ,changeCurrentPassword};
