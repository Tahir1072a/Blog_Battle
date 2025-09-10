import express from "express";
import {
  createBattleController,
  getActiveBattle,
} from "../controllers/battleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveBattle);
router.post("/create", protect, createBattleController);

export default router;
