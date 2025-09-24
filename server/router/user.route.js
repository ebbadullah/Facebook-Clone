import express from "express";
const router = express.Router();
import { checkAuthentication, getUser, login, logout, register, verifyOTP, suggestedUser, getUserById, followAndUnfollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, getUserFriends, blockUser, unblockUser, getBlockedUsers, updateProfile, updateProfilePicture, searchUsers } from "../controller/user.controller.js";
import { body } from "express-validator";
import auth from "../middleware/auth.js";
import upload from "../utils/multer.js";

let validation = [
    body("username").notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("name").notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

router.post("/register", validation, register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", logout);
router.get("/checkAuthentication", auth, checkAuthentication);

router.get("/getUser", auth, getUser);
router.get("/suggestedUser", auth, suggestedUser);
router.get("/getUserById/:userId", auth, getUserById);
router.put("/followAndUnfollow/:id", auth, followAndUnfollow);

router.post("/friend-request/:receiverId", auth, sendFriendRequest);
router.post("/friend-request/:senderId/accept", auth, acceptFriendRequest);
router.post("/friend-request/:senderId/reject", auth, rejectFriendRequest);
router.get("/friend-requests", auth, getFriendRequests);
router.get("/friends", auth, getUserFriends);

router.post("/block/:userId", auth, blockUser);
router.post("/unblock/:userId", auth, unblockUser);
router.get("/blocked-users", auth, getBlockedUsers);

router.put("/profile", auth, updateProfile);
router.put("/profile-picture", auth, upload.single("profilePicture"), updateProfilePicture);

router.get("/search", auth, searchUsers);

export default router;