import Notification from "../models/Notification.js";

// @desc    Giriş yapmış kullanıcının bildirimlerini getirir
// @route   GET /api/notifications
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10); // Son 10 bildirimi getir
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Bildirimler alınamadı." });
  }
};
