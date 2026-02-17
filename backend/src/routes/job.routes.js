import { Router } from "express";
import { postJob, getMyJobs,getAllJobs,applyForJob,getJobApplications,getMyApplications,updateJobStatus,updateApplicationStatus } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply VerifyJWT to all routes
// router.use(verifyJWT);

// 🔒 SECURITY CHECK: Only Alumni can access these
// You can move this to a separate middleware file like `verifyAlumni`
const isAlumni = (req, res, next) => {
    if (req.user.role?.toUpperCase() !== "ALUMNI" && req.user.role?.toUpperCase() !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Alumni only." });
    }
    next();
};

// Routes
router.route("/post").post(verifyJWT,isAlumni, postJob);
router.route("/my-jobs").get(verifyJWT,isAlumni, getMyJobs);

router.route("/all").get(verifyJWT,getAllJobs);

// Student Route (Apply)
router.route("/apply/:jobId").post(verifyJWT,applyForJob);

router.route("/applications/:jobId").get(verifyJWT,isAlumni, getJobApplications);

router.route("/my-applications").get(verifyJWT, getMyApplications);

router.route("/:jobId/status").patch(verifyJWT, isAlumni, updateJobStatus);

router.route("/applications/:applicationId/status")
    .patch(verifyJWT, isAlumni, updateApplicationStatus);

export default router;