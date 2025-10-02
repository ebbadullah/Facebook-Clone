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
app.set("trust proxy", 1); // render ke liye important

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// ---------- MIDDLEWARES ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  process.env.FRONTEND_URL  // vercel frontend url
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow tools like postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🚫 Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  })
);

// database connect
connectDB();

// ---------- ROUTES ----------
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API working fine 🚀" });
});

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/stories", storyRoute);

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    status: false,
    message: err.message || "Something broke!",
    error: !isProduction ? err.message : undefined,
  });
});

// ---------- START SERVER ----------
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
