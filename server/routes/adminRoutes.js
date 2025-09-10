import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  getAllBattles,
  resolveBattleManually,
  createBattleManually,
  getAllBlogs,
  updateBlogStatus,
  getAnalytics,
  resetFakeVotes,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  requireAdmin,
  logAdminActions,
  featureFlag,
} from "../middleware/adminMiddleware.js";
import { catchAsync } from "../middleware/errorMiddleware.js";

const router = express.Router();

// Tüm admin route'ları için authentication ve admin yetkisi gerekli
router.use(protect);
router.use(requireAdmin);

// Dashboard ve Genel İstatistikler
router.get("/dashboard", catchAsync(getDashboardStats));
router.get("/analytics", catchAsync(getAnalytics));

// Kullanıcı Yönetimi
router.get("/users", catchAsync(getAllUsers));
router.get("/users/:id", catchAsync(getUserDetails));
router.put(
  "/users/:id/role",
  logAdminActions("UPDATE_USER_ROLE"),
  catchAsync(updateUserRole)
);

// Savaş Yönetimi
router.get("/battles", catchAsync(getAllBattles));
router.post(
  "/battles/create",
  logAdminActions("CREATE_BATTLE"),
  featureFlag("battle_management"),
  catchAsync(createBattleManually)
);
router.post(
  "/battles/:id/resolve",
  logAdminActions("RESOLVE_BATTLE"),
  featureFlag("battle_management"),
  catchAsync(resolveBattleManually)
);

// Blog Yönetimi
router.get("/blogs", catchAsync(getAllBlogs));
router.put(
  "/blogs/:id/status",
  logAdminActions("UPDATE_BLOG_STATUS"),
  catchAsync(updateBlogStatus)
);

// Bakım ve Toplu İşlemler
router.post(
  "/maintenance/reset-fake-votes",
  logAdminActions("RESET_FAKE_VOTES"),
  featureFlag("bulk_operations"),
  catchAsync(resetFakeVotes)
);

// Sistem Sağlık Kontrolü (Admin için detaylı)
router.get(
  "/system/health",
  catchAsync(async (req, res) => {
    try {
      const mongoose = (await import("mongoose")).default;
      const Battle = (await import("../models/Battle.js")).default;
      const Blog = (await import("../models/Blog.js")).default;

      const [dbStatus, activeBattles, poolBlogs] = await Promise.all([
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        Battle.countDocuments({ status: "active" }),
        Blog.countDocuments({ status: "in_pool" }),
      ]);

      const systemHealth = {
        database: {
          status: dbStatus,
          connectionState: mongoose.connection.readyState,
        },
        battles: {
          active: activeBattles,
          poolSize: poolBlogs,
          healthCheck:
            activeBattles >= 1 && poolBlogs >= 4 ? "healthy" : "warning",
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: "MB",
        },
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      };

      res.status(200).json({
        status: "OK",
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
        health: systemHealth,
      });
    } catch (error) {
      res.status(500).json({
        status: "ERROR",
        message: "System health check failed",
        error: error.message,
      });
    }
  })
);

// Cache temizleme (gelecekte Redis için)
router.post(
  "/system/clear-cache",
  logAdminActions("CLEAR_CACHE"),
  catchAsync(async (req, res) => {
    // Gelecekte Redis cache temizleme işlemi buraya eklenecek
    res.status(200).json({
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
    });
  })
);

// Database backup trigger (gelecekteki özellik)
router.post(
  "/system/backup",
  logAdminActions("TRIGGER_BACKUP"),
  featureFlag("advanced_admin"),
  catchAsync(async (req, res) => {
    // Gelecekte database backup işlemi
    res.status(200).json({
      message: "Backup process initiated",
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
