import { Router } from "express";
import { changeOldPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateUserDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)


router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/password-reset").post(verifyJWT, changeOldPassword)
router.route("/update-user-details").patch(verifyJWT, updateUserDetails)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
export { router }

