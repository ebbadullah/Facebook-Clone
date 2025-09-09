import express from "express";
let route = express.Router();
import { postCreate, likeDislike, getAllPosts, bookmarkPost, postComment, deletePost, updatePost, sharePost, getPostLikes, getUserPosts, setReaction } from "../controller/post.controller.js";
import auth from "../middleware/auth.js";
import upload from "../utils/multer.js";

route.post("/create", auth, upload.array("media", 5), postCreate);

route.put("/:id/like", auth, likeDislike);
route.put("/:id/reaction", auth, setReaction);
route.get("/", auth, getAllPosts);
route.put("/:id/bookmark", auth, bookmarkPost);
route.post("/:id/comment", auth, postComment);
route.delete("/:id", auth, deletePost);
route.put("/:id", auth, updatePost);

route.post("/:id/share", auth, sharePost);
route.get("/:id/likes", auth, getPostLikes);
route.get("/user/:userId", auth, getUserPosts);

export default route;