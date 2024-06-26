import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // console.log(req.header("Authorization"));
        const token = await req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")


        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


        const user = await User.findById(decodedToken._id).select("-password -refreshToken")


        // console.log(user);
        if (!user) {
            throw new ApiError(401, "Invalide access token")
        }
        req.user = user
        next()
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalide access token")
    }
})