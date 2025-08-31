import express from "express";
let route = express.Router();
import { checkAuthentication, getUser, login, logout, register, verifyOTP, suggestedUser, getUserById, followAndUnfollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, blockUser, unblockUser, getBlockedUsers, updateProfile, updateProfilePicture, } from "../controller/user.controller.js";
import { body } from "express-validator";
import auth from "../middleware/auth.js";
import upload from "../utils/multer.js";

let validation = [
    body("username").notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("name").notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Authentication routes
route.post("/register", validation, register);
route.post("/verify-otp", verifyOTP);
route.post("/login", login);
route.get("/logout", logout);
route.get("/checkAuthentication", auth, checkAuthentication);

// User routes
route.get("/getUser", auth, getUser);
route.get("/suggestedUser", auth, suggestedUser);
route.get("/getUserById/:userId", auth, getUserById);
route.put("/followAndUnfollow/:id", auth, followAndUnfollow);

// Friend request routes
route.post("/friend-request/:receiverId", auth, sendFriendRequest);
route.post("/friend-request/:senderId/accept", auth, acceptFriendRequest);
route.post("/friend-request/:senderId/reject", auth, rejectFriendRequest);
route.get("/friend-requests", auth, getFriendRequests);

// Block user routes
route.post("/block/:userId", auth, blockUser);
route.post("/unblock/:userId", auth, unblockUser);
route.get("/blocked-users", auth, getBlockedUsers);

// Profile update routes
route.put("/profile", auth, updateProfile);
route.put("/profile-picture", auth, upload.single("profilePicture"), updateProfilePicture);

export default route;