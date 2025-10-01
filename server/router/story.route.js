import express from "express";
import {  createStory,  getStories,  getUserStories,  toggleStoryLike,  viewStory,  deleteStory,} from "../controller/story.controller.js";
import protect from "../middleware/auth.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.use(protect);

router.post("/", upload.single("media"), createStory);

router.get("/", getStories);

router.get("/user/:userId", getUserStories);

router.patch("/:storyId/like", toggleStoryLike);

router.patch("/:storyId/view", viewStory);

router.delete("/:storyId", deleteStory);

export default router;


