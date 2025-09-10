import express from "express";
import {
  getMyNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.post("/read", protect, markNotificationsAsRead);

export default router;
