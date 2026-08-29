import express from "express";
import { store } from "../models/store.js";

const router = express.Router();

// GET all notifications
router.get("/", (req, res) => {
  const notifs = store.getNotifications();
  res.json({
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.isRead).length
  });
});

// PUT Mark specific notification as read
router.put("/:id/read", (req, res) => {
  const notif = store.markNotificationRead(req.params.id);
  if (!notif) return res.status(404).json({ error: "Notification not found" });
  res.json({ success: true, notification: notif });
});

// PUT Mark all notifications as read
router.put("/read-all", (req, res) => {
  store.markAllNotificationsRead();
  res.json({ success: true, message: "All notifications marked as read" });
});

export default router;
