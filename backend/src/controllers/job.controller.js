import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Job } from "../models/job.model.js";

import { Application } from "../models/application.model.js";
import { Profile } from "../models/profile.model.js"

import { calculateAtsScore } from "../utils/aiAts.js";

// 1. Post a New Job (Alumni Only)
const postJob = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        company,
        location,
        jobType,
        salaryRange,
        requiredSkills, // Expecting "React, Node.js, MongoDB" or ["React", "Node"]
        workMode
    } = req.body;

    // A. Validation
    if ([title, description, company, location, jobType].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // B. Normalize Skills (Convert "React, Node" string to ["react", "node"])
    let skillsArray;
    if (typeof requiredSkills === "string") {
        skillsArray = requiredSkills.split(",").map(skill => skill.trim());
    } else if (Array.isArray(requiredSkills)) {
        skillsArray = requiredSkills;
    } else {
        skillsArray = []; // Handle edge case
    }

    // C. Create Job
    const job = await Job.create({
        title,
        description,
        company,
        location,
        jobType,
        workMode: workMode || "On-site",
        salaryRange: salaryRange || "Not disclosed",
        requiredSkills: skillsArray,
        postedBy: req.user._id, // Link to logged-in Alumni
        status: "OPEN"
    });

    return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});


// 2. Get My Posted Jobs (Alumni Dashboard)
const getMyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ postedBy: req.user._id })
        .sort({ createdAt: -1 }); // Newest first

    return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});


// 3. get all jobs for students according to their queries and filter
/*
filter.status = "OPEN": This ensures that when an Alumni closes a job (or it auto-expires), it immediately disappears from the feed without you needing to delete the database record.

populate("postedBy"): This is vital. On the frontend card, you can now show: "Posted by Rahul (Ex-Google)" instead of just a generic job listing. This builds trust.

$regex Search: Allows partial matching. Searching "react" will find "React Developer", "ReactJS Intern", etc.
*/
const getAllJobs = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,      // Search text (Title or Company)
        type,       // Job Type (Internship, Full-time)
        mode,       // Work Mode (Remote, On-site)
        location    // Specific location
    } = req.query;

    // 1. Build the Query Object
    const filter = {
        status: { $in: ["OPEN", "PAUSED"] },
        isFlagged: false,
        postedBy: { $ne: req.user._id }  // Exclude own jobs
    };

    // 2. Add Search Logic (Regex)
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { company: { $regex: query, $options: "i" } }
        ];
    }

    // 3. Add Filters (only if they exist in request)
    if (type) filter.jobType = type;
    if (mode) filter.workMode = mode;
    if (location) filter.location = { $regex: location, $options: "i" };

    // 4. Pagination Logic
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // 5. Execute Query
    const jobs = await Job.find(filter)
        .populate("postedBy", "fullName avatar headline") // Show Recruiter details
        .sort({ createdAt: -1 }) // Newest jobs first
        .skip(skip)
        .limit(limitNum);

    // 6. Get Total Count (For Frontend Pagination UI)
    const totalJobs = await Job.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            jobs,
            pagination: {
                total: totalJobs,
                page: pageNum,
                pages: Math.ceil(totalJobs / limitNum)
            }
        }, "Jobs fetched successfully")
    );
});



// 4. Apply for a Job (Student)
/* 
Resume Snapshot: We grab studentProfile.resume and save it to the Application. If the student changes their resume tomorrow to apply for a different job, this application still points to the old resume (which is correct—that's what they applied with).

Atomic Increment: $inc: { applicantCount: 1 } is thread-safe. If 100 people apply at once, the counter will be accurate.

Self-Apply Block: Prevents Alumni from artificially inflating their own job stats.
*/
const applyForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const studentId = req.user._id;

    // A. Check if Job Exists & is OPEN
    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");

    if (job.status === "PAUSED") throw new ApiError(400, "This job is currently paused and not accepting applications");
    if (job.status === "CLOSED") throw new ApiError(400, "This job is closed and no longer accepting applications");

    // B. Prevent "Self-Applying" (Alumni can't apply to own job)
    if (job.postedBy.toString() === studentId.toString()) {
        throw new ApiError(400, "You cannot apply to your own job");
    }

    // C. Check if Student has a Resume
    const studentProfile = await Profile.findOne({ owner: studentId });
    if (!studentProfile || !studentProfile.resume) {
        throw new ApiError(400, "Please upload a resume in your profile before applying");
    }

    // D. Idempotency Check (Double Apply)
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: studentId
    });

    if (existingApplication) {
        throw new ApiError(400, "You have already applied for this job");
    }

    // ---------------------------------------------------------
    // 🧠 AI INTEGRATION START
    // ---------------------------------------------------------
    console.log(`🚀 Triggering AI for Job: ${job.title}, Applicant: ${req.user.fullName}`);

    // Default values in case AI fails
    let aiResult = {
        matchScore: 0,
        aiAnalysis: "Pending Analysis...",
        missingSkills: []
    };

    try {
        // Call your utility (This takes ~3-5 seconds)
        aiResult = await calculateAtsScore(
            studentProfile.resume,    // URL from Supabase
            job.description,          // Job Desc
            job.requiredSkills || []  // Skills Array
        );
        console.log(`✅ AI Score Calculated: ${aiResult.matchScore}/100`);

    } catch (err) {
        console.error("⚠️ AI Scoring Failed (Continuing application anyway):", err.message);
        // We continue execution so the student can still apply even if AI fails
    }
    // ---------------------------------------------------------

    // E. Create Application (With AI Data)
    const application = await Application.create({
        job: jobId,
        applicant: studentId,
        recruiter: job.postedBy,
        resume: studentProfile.resume,
        status: "APPLIED",

        // 💾 Save the AI Results
        matchScore: aiResult.matchScore || 0,
        aiAnalysis: aiResult.aiAnalysis || "Analysis failed.",
        // If your Application schema supports missingSkills, add it here:
        // missingSkills: aiResult.missingSkills 
    });

    // F. Increment Applicant Count on Job
    await Job.findByIdAndUpdate(jobId, {
        $inc: { applicantCount: 1 }
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Applied successfully with AI Analysis!")
    );
});



// 5. Get Applications for a Job (Alumni Only)
const getJobApplications = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const alumniId = req.user._id;

    // A. Verify Job Ownership
    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");

    if (job.postedBy.toString() !== alumniId.toString()) {
        throw new ApiError(403, "You are not authorized to view these applications");
    }

    // B. Fetch Applications
    const applications = await Application.find({ job: jobId })
        .populate("applicant", "fullName avatar headline email") // Get student details
        .sort({ matchScore: -1 }); // 🌟 AI MAGIC: Best matches first!

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications fetched successfully")
    );
});

// 6. Get My Applications (Student) — returns just the job IDs they've applied to
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({
        applicant: req.user._id
    })
    .populate("job", "title company location jobType workMode salaryRange status")
    .populate("recruiter", "fullName")
    .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, applications, "Applications fetched"));
});

// 7. Update Job Status (Alumni — OPEN / CLOSED / PAUSED)
const updateJobStatus = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!["OPEN", "CLOSED", "PAUSED"].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be OPEN, CLOSED, or PAUSED");
    }

    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");

    // Only the owner can change status
    if (job.postedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this job");
    }

    job.status = status;
    await job.save();

    return res.status(200).json(new ApiResponse(200, job, `Job marked as ${status}`));
});

// 8. Update Application Status (Alumni Pipeline)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["APPLIED", "SHORTLISTED", "INTERVIEWING", "REJECTED", "HIRED"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const application = await Application.findById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    // Only the recruiter (job poster) can update status
    if (application.recruiter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    application.status = status;
    await application.save();

    return res.status(200).json(
        new ApiResponse(200, application, `Application marked as ${status}`)
    );
});


export { postJob, getMyJobs, getAllJobs, applyForJob, getJobApplications, getMyApplications, updateJobStatus ,updateApplicationStatus};