import dotenv from "dotenv";
dotenv.config(); // Load .env to get GEMINI_API_KEY
import { calculateAtsScore } from "./src/utils/aiAts.js";

const runTest = async () => {
    // 1. Paste a REAL Supabase Resume URL from your database here
    const testResumeUrl = "https://ishbedydrqmqnbsjlhik.supabase.co/storage/v1/object/public/resumes/1770223894394-bhushan_resume.pdf"; 
    
    const jobDesc = "We are looking for a MERN Stack developer with experience in Socket.io and Redis.";
    const skills = ["React", "Node.js", "MongoDB", "Redis", "Socket.io"];

    console.log("Testing AI...");
    const result = await calculateAtsScore(testResumeUrl, jobDesc, skills);
    console.log("Result:", result);
};

runTest();