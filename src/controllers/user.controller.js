import { upload } from "../middlewares/multer.middleware.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodCloudinary } from "../utils/cloudinary.js";

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
    console.log(username,email,password);

    if ([fullName, password, email, username].some((field) => field?.trim() === "")) {

        throw new ApiError(400, "All field are required")

    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path
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
    return  res.status(201).json(new ApiResponse(200,createUser,"User register successfully"))

})
export { registerUser }