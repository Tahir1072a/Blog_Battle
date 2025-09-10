import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Notification from "../models/Notification.js";
import { sendLevelUpNotification } from "./notificationService.js";

export const USER_LEVELS = {
  1: { name: "Çaylak", minPosts: 0, minWins: 0, badge: "🌱" },
  2: { name: "Köşe Yazarı", minPosts: 3, minWins: 2, badge: "✍️" },
  3: { name: "Usta Kalem", minPosts: 10, minWins: 8, badge: "🖋️" },
};

export const calculateUserStats = async (userId) => {
  const totalPosts = await Blog.countDocuments({ author: userId });

  const userBlogs = await Blog.find({ author: userId }).select("_id");
  const blogIds = userBlogs.map((blog) => blog._id);
  const totalWins = await Battle.countDocuments({ winner: { $in: blogIds } });

  return { totalPosts, totalWins };
};

export const calculateUserLevel = async (userId) => {
  const stats = await calculateUserStats(userId);
  let currentLevel = 1;

  for (const level in USER_LEVELS) {
    const requirements = USER_LEVELS[level];
    if (
      stats.totalPosts >= requirements.minPosts &&
      stats.totalWins >= requirements.minWins
    ) {
      currentLevel = parseInt(level, 10);
    } else {
      break;
    }
  }

  return {
    level: currentLevel,
    ...USER_LEVELS[currentLevel],
    nextLevel: USER_LEVELS[currentLevel + 1] || null,
  };
};

/**
 * Bir savaş sonrası kullanıcının seviye atlayıp atlamadığını kontrol eder.
 */
export const checkAndHandleLevelUp = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const previousLevel = user.level || 1;
  const {
    level: newLevel,
    name: newLevelName,
    badge,
  } = await calculateUserLevel(userId);

  if (newLevel > previousLevel) {
    user.level = newLevel;
    await user.save();

    await sendLevelUpNotification(userId, newLevelName, badge);

    console.log(`User ${user.name} leveled up to ${newLevelName}`);
  }
};
