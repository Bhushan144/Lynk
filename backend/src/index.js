import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
}) //load environment variables from a .env file into process.env

import {connectDb} from '../src/db/index.js'
import "./app.js";
import {server} from "./socket.js";

connectDb()
.then(()=>{
    server.on("error",(err)=>{
        console.log("error occured on server",err);
    })

    const PORT = process.env.PORT || 5000;
    server.listen(PORT,()=>{
        console.log(`app listening on port: ${PORT}`);
    })
})
.catch((err)=>{
    console.log("mongo db connectio failed : ",err);
})