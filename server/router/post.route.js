// Updated post.route.js (temporary solution)
import express from "express";
let route = express.Router();
import { postCreate, likeDislike, getAllPosts, bookmarkPost, postComment, deletePost, updatePost, sharePost, getPostLikes, getUserPosts, } from "../controller/post.controller.js";
import auth from "../middleware/auth.js";
import upload from "../utils/multer.js";

// Keep the old endpoint for compatibility
route.post("/create", auth, upload.single("media"), postCreate);

// New style routes for other endpoints
route.put("/:id/like", auth, likeDislike);
route.get("/", auth, getAllPosts);
route.put("/:id/bookmark", auth, bookmarkPost);
route.post("/:id/comment", auth, postComment);
route.delete("/:id", auth, deletePost);
route.put("/:id", auth, updatePost);

// New functionality routes
route.post("/:id/share", auth, sharePost);
route.get("/:id/likes", auth, getPostLikes);
route.get("/user/:userId", auth, getUserPosts);

export default route;