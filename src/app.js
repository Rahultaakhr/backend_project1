import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import  { router as userRoute} from"./routes/user.route.js";

const app = express()

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// routes decleration

app.use("/api/v1/users",userRoute)


export { app }
