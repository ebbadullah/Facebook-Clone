import express from "express";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount, } from "../controller/notification.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getUserNotifications);

router.patch("/:notificationId/read", markNotificationAsRead);

router.patch("/mark-all-read", markAllNotificationsAsRead);

router.get("/unread-count", getUnreadNotificationCount);

export default router;


