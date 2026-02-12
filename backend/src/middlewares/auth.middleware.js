import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'

const verifyJWT = asyncHandler(async(req, res,next) => {
    try {
        // 1. Get token from Cookie OR Header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        // 2. Decode Token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // 3. Find User
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // 4. Attach user to Request object
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export {verifyJWT};