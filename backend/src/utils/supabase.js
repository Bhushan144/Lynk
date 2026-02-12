import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// 1. Configure Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use the SERVICE_ROLE key (not anon)
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadToSupabase = async (localFilePath, originalName) => {
    try {
        if (!localFilePath) return null;

        // Create a unique file name so users don't overwrite each other
        // e.g., "resume-123456789.pdf"
        const timestamp = Date.now();
        const cleanName = originalName.replace(/\s+/g, '-'); // Remove spaces
        const fileName = `${timestamp}-${cleanName}`;

        // Read the file buffer
        const fileBuffer = fs.readFileSync(localFilePath);

        // 2. Upload to "resumes" bucket
        const { data, error } = await supabase
            .storage
            .from('resumes') // Ensure you created this bucket in dashboard
            .upload(fileName, fileBuffer, {
                contentType: 'application/pdf', // Ensures browser views it, doesn't download it
                upsert: false
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return null;
        }

        // 3. Get the Public URL
        const { data: urlData } = supabase
            .storage
            .from('resumes')
            .getPublicUrl(fileName);

        // 4. Remove local file (cleanup)
        fs.unlinkSync(localFilePath);

        return { url: urlData.publicUrl };

    } catch (error) {
        console.error("File upload failed:", error);
        // Attempt to cleanup even on error
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadToSupabase };