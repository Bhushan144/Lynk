import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import {app} from "./socket.js"
import multer from 'multer'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// const app = express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true  //Allow the browser to send cookies, authorization headers, or TLS client certificates along with the request.
}))

app.use(helmet())
app.use(morgan('dev'))

app.use(express.json({limit:'16kb'}))  //Parses incoming requests with JSON bodies and only except request where json body is smaller than 16kb

app.use(express.urlencoded({extended:true,limit:'16kb'})) //Parses URL-encoded form data

app.use(cookieParser())  //Express doesn't populate req.cookies by default — use cookie-parser (or another parser) to get req.cookies and req.signedCookies.

app.use(express.static(
    path.join(__dirname,'..','public')
))



//User Routes import and use
import userRouter from './routes/user.routes.js'
app.use('/api/v1/users',userRouter)


//auth routes import and use
import authRouter from './routes/auth.routes.js';
app.use("/api/v1/auth",authRouter);

//admin router import and use
import adminRouter from './routes/admin.routes.js';
app.use("/api/v1/admin",adminRouter);

//profile routes
import profileRouter from "./routes/profile.routes.js";
app.use("/api/v1/profile",profileRouter);

import chatRouter from './routes/chat.routes.js'
app.use("/api/v1/chat", chatRouter)


// Global Error Handler
app.use((err, req, res, next) => {
    // 1. Handle Multer Errors (File size, missing field, etc.)
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File is too large! Maximum limit is 5MB."
            });
        }
        // Catch-all for other Multer errors
        return res.status(400).json({ 
            success: false, 
            message: "File upload error: " + err.message 
        });
    } 
    
    // 2. Handle Custom Errors (like your "File type not supported")
    else if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }

    next();
});


app.get('/',(req,res)=>{
    res.send("Lynk API is ready ...");
})

export {app}