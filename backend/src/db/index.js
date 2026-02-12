import mongoose from "mongoose";

import {DB_NAME} from "../constants.js"

const connectDb = async () =>{
    try{
        const connectionInstance =await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB connected !! DB host : ${connectionInstance.connection.host}`);
        
    }   
    catch(err){
        console.log("MONGODB Connection failed ",err);
        process.exit(1);
    }
}

export {connectDb};