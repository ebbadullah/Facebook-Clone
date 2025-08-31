import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectiondb.js";
import cors from "cors";

import "./model/user.schema.js";
import "./model/post.schema.js";
import "./model/notification.schema.js";
import "./model/story.schema.js";
import "./model/comment_schema.js";

import userRoute from "./router/user.route.js";
import postRoute from "./router/post.route.js";
import notificationRoute from "./router/notification.route.js";
import storyRoute from "./router/story.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

connectDB();

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/stories", storyRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: "Something broke!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});