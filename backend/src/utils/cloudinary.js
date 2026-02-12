import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if(!localFilePath){
            return null;
        }
        // 1. Upload the file to Cloudinary
        //    resourceType: "auto" for images/avatars, "raw" for PDFs/resumes
        let response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: resourceType,
            folder:"Lynk"
        })

        if(!response){
            console.log("upload Failed")
            return null;
        }

        // 2. File has been uploaded successfully
        console.log("file uploded on cloudinary: "+ response.url);

        // 3. Remove the locally saved temporary file
        await fs.unlink(localFilePath).catch(()=>{
            console.log("file already deleted or not exist")
        });

        return {
            url:response.secure_url,
            public_id:response.public_id
        };
        
    } catch (error) {
        // Upload failed. 
        // We must remove the local file to keep the server clean.
        console.log(error)
        await fs.unlink(localFilePath).catch(()=>{
            console.log("file already deleted or not exist")
        });
        return null;
    }
}

export {uploadOnCloudinary};