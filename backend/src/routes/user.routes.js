import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'
import { updateVerificationDetails } from '../controllers/user.controller.js';
import { sensitiveLimiter } from '../middlewares/rateLimit.middleware.js';

let router = Router();


router.route("/update-verification").patch(
    verifyJWT,
    sensitiveLimiter,
    upload.single("verificationImage"),
    updateVerificationDetails
);

export default router;