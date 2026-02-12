import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

const verifyAdmin = asyncHandler(async (req,res,next)=>{
    //verify jwt has already populate the req.user
    //we just check the role.
    if(req.user.role !== "ADMIN"){
        throw new ApiError(403,"Access Denied: Admins Only")
    }
    next();
})

export {verifyAdmin};