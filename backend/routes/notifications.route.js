import express from "express";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotifications,
  getNotificationStats,
  triggerNotificationCheck,
  getSchedulerStatus
} from "../controllers/notifications.controller.js";

const router = express.Router();

// Routes
router.get("/", getNotifications);
router.get("/stats", getNotificationStats);
router.get("/scheduler/status", getSchedulerStatus);
router.post("/", createNotification);
router.post("/check", triggerNotificationCheck);
router.put("/:id", updateNotification);
router.delete("/", deleteNotifications);

export default router;
