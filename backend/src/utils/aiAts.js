import { GoogleGenerativeAI } from "@google/generative-ai";
// Legacy build to prevent Node.js crashes
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export const calculateAtsScore = async (resumeUrl, jobDescription, requiredSkills) => {
    try {
        console.log("🤖 AI ATS: Fetching resume from:", resumeUrl);

        // 1. Fetch PDF
        const response = await fetch(resumeUrl);
        if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();

        // 2. Load PDF (Legacy Build)
        const loadingTask = pdfjsLib.getDocument({ 
            data: arrayBuffer,
            disableFontFace: true, 
            verbosity: 0
        });

        const pdfDocument = await loadingTask.promise;
        let fullText = "";
        
        // 3. Extract Text
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            fullText += pageText + " ";
        }

        if (!fullText || fullText.trim().length < 50) {
            return { matchScore: 0, aiAnalysis: "Scan/Image detected.", missingSkills: [] };
        }

        // 4. Initialize Gemini (Inside function)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 🔥 THE FIX: Using a model from YOUR valid list 🔥
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Act as an ATS.
            Job Description: "${jobDescription.substring(0, 800)}"
            Required Skills: "${requiredSkills.join(", ")}"
            Resume: "${fullText.substring(0, 3000).replace(/\n/g, " ")}"

            Output JSON ONLY:
            { "matchScore": number, "aiAnalysis": "string", "missingSkills": [] }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("❌ AI ATS Error:", error.message);
        return {
            matchScore: 0,
            aiAnalysis: "Analysis failed due to a server error.",
            missingSkills: []
        };
    }
};