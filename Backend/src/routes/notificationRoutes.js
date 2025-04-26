// routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.js";

const router = express.Router();

// GET all notifications
router.get("/", (req, res) => {
  try {
    const data = getNotifications();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// PUT to mark a notification as read
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { read } = req.body;

    const updated = updateNotificationStatus(id, read);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification" });
  }
});

export default router;
