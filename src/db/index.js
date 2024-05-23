import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnetion=async()=>{
try {
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log('Connection Success fully ',connectionInstance.connection.host);



} catch (error) {
    console.log("MONGODB CONNETING FAILED ",Error);
}
}
export {dbConnetion}