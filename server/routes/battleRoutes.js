import express from "express";
import {
  createBattleController,
  getActiveBattle,
  getAllActiveBattles,
} from "../controllers/battleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllActiveBattles);

router.get("/active", getActiveBattle);
router.post("/create", protect, createBattleController);

export default router;
