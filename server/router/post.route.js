import express from "express";
const router = express.Router();
import { postCreate, likeDislike, getAllPosts, bookmarkPost, postComment, deletePost, updatePost, sharePost, getPostLikes, getUserPosts, setReaction } from "../controller/post.controller.js";
import auth from "../middleware/auth.js";
import upload from "../utils/multer.js";

router.post("/create", auth, upload.array("media", 5), postCreate);

router.put("/:id/like", auth, likeDislike);
router.put("/:id/reaction", auth, setReaction);
router.get("/", auth, getAllPosts);
router.put("/:id/bookmark", auth, bookmarkPost);
router.post("/:id/comment", auth, postComment);
router.delete("/:id", auth, deletePost);
router.put("/:id", auth, updatePost);

router.post("/:id/share", auth, sharePost);
router.get("/:id/likes", auth, getPostLikes);
router.get("/user/:userId", auth, getUserPosts);

export default router;