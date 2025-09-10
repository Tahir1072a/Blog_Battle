import express from "express";
import {
  getAllUsers,
  getAllBattles,
  createBattleManually,
  resolveBattleManually,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { catchAsync } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", catchAsync(getAllUsers));
router.get("/battles", catchAsync(getAllBattles));

router.post("/battles/create", catchAsync(createBattleManually));
router.post("/battles/:id/resolve", catchAsync(resolveBattleManually));

// Not: Sahte oyları sıfırlama da eklenebilir, şimdilik basit tutuyoruz.

export default router;
