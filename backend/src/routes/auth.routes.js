import { Router } from "express";
import { registerUser, loginUser, logoutUser, generateAccessAndRefreshTokens, updateUserAvatar, seedDatabase,changeCurrentPassword } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

// PATCH Route for Avatar
router.route("/avatar").patch(
    verifyJWT,                  // 1. User must be logged in
    upload.single("avatar"),    // 2. Middleware: Handle 1 file named "avatar"
    updateUserAvatar            // 3. Controller: Upload to Cloudinary & Update DB
);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);


// TEMPORARY SEED ROUTE (No VerifyJWT needed for this test)
router.route("/seed").get(seedDatabase);

export default router;