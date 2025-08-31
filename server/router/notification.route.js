import express from "express";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount, } from "../controller/notification.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user notifications
router.get("/", getUserNotifications);

// Mark notification as read
router.patch("/:notificationId/read", markNotificationAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", markAllNotificationsAsRead);

// Get unread notification count
router.get("/unread-count", getUnreadNotificationCount);

export default router;


