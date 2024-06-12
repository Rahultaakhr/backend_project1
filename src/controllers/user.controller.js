import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log("Before save: ", accessToken);

        user.refreshToken = refreshToken

        console.log("After save: ", accessToken);
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}






const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    // validation - not empty
    // check if user is already exists
    // check for images - check for avatar
    // upload them on cloudinay
    // create user object - create entry in db
    // remove password and refresh token field from response
    // return response


    const { fullName, username, email, password } = req.body
    console.log(username, email, password);

    if ([fullName, password, email, username].some((field) => field?.trim() === "")) {

        throw new ApiError(400, "All field are required")

    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uplaodCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        // coverImage: coverImage.url || "",
        email,
        username: username.toLowerCase(),
        password
    })

    const createUser = await User.findOne(user._id).select(
        " -password -refreshToken"
    )
    console.log(createUser);
    if (!createUser) {
        throw new ApiError(500, "Something went wrong")
    }
    return res.status(201).json(new ApiResponse(200, createUser, "User register successfully"))

})


const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPassowrdValid = await user.isPasswordCorrect(password)

    if (!isPassowrdValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

    console.log(accessToken);
    console.log(refreshToken);

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, refreshToken, accessToken
                },
                "User login successfully"

            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {

    console.log(req.user);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined // this remove the field from the document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalide refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired or used")
        }

        const { newRefreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },

                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error.message || "Invalide refresh token")
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken }