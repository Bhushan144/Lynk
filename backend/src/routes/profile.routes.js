import {Router} from 'express'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyProfile, updateProfile,getAllProfiles,getUserProfile,uploadResume,updateBanner } from "../controllers/profile.controller.js";
import { upload } from '../middlewares/multer.middleware.js'

let router = Router();


router.route("/me").get(verifyJWT,getMyProfile);
router.route("/update").patch(verifyJWT,updateProfile);

// NEW ROUTE: Upload Resume
// Accepts a single file with field name "resume"
router.route("/resume").patch(
    verifyJWT, 
    upload.single("resume"), 
    uploadResume
);


router.route("/banner").patch(
    verifyJWT,
    upload.single("banner"), // Field name must match frontend
    updateBanner
);

//The public field
// Note: We might want to add a middleware 'verifyApproved' here later if you strictly want to block unverified users. 
// For now, let's keep it accessible to logged-in users so you can test it easily.
router.route("/feed").get(verifyJWT,getAllProfiles)

router.route("/public/:id").get(getUserProfile);

export default router;