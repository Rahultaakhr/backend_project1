import dotenv from "dotenv";
import { app } from "./app.js";
import { dbConnetion } from "./db/index.js";

dotenv.config()



dbConnetion()
.then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log("Hello Server is running ");
    })
})
.catch((err)=>{
    console.log(err);
})
