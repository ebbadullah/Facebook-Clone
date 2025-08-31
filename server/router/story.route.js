import express from "express";
import {  createStory,  getStories,  getUserStories,  toggleStoryLike,  viewStory,  deleteStory,} from "../controller/story.controller.js";
import protect from "../middleware/auth.js";
import upload from "../utils/multer.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create story
router.post("/", upload.single("media"), createStory);

// Get stories for feed
router.get("/", getStories);

// Get user's stories
router.get("/user/:userId", getUserStories);

// Like/unlike story
router.patch("/:storyId/like", toggleStoryLike);

// View story
router.patch("/:storyId/view", viewStory);

// Delete story
router.delete("/:storyId", deleteStory);

export default router;


