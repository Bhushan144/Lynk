import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {verifyAdmin} from "../middlewares/admin.middleware.js";

import {getPendingVerifications,verifyUser} from "../controllers/admin.controller.js";


const router = Router();

router.route("/pending").get(verifyJWT,verifyAdmin,getPendingVerifications);
router.route("/verify").post(verifyJWT,verifyAdmin,verifyUser);

export default router;
