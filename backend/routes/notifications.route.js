import express from "express";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotifications,
  getNotificationStats
} from "../controllers/notifications.controller.js";

const router = express.Router();

// Routes
router.get("/", getNotifications);
router.get("/stats", getNotificationStats);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/", deleteNotifications);

export default router;
