import multer from 'multer'

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

//import.meta.url => file:///C:/Users/Bhushan/LYNK/backend/src/middlewares/multer.middleware.js

const __filename = fileURLToPath(import.meta.url) //C:\Users\Bhushan\LYNK\backend\src\middlewares\multer.middleware.js
const __dirname = path.dirname(__filename);  //C:\Users\Bhushan\LYNK\backend\src\middlewares


const tempDir = path.resolve(__dirname, "../../public/temp")

// ensure directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir)  // Save file to the temp folder
    },
    filename: function (req, file, cb) {
        const timeStamp = Date.now();
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).replace(/\s+/g, "_");

        cb(null, `${basename}_${timeStamp}${ext}`);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB in bytes
    },
    fileFilter: function (req, file, cb) {
        // Accept images and pdfs only
        if (
            file.mimetype === "application/pdf" ||
            file.mimetype.startsWith("image/")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDF files are allowed!"), false);
        }
    }
})

export { upload };