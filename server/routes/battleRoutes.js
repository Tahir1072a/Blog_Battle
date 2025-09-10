import express from "express";
import {
  createBattleController,
  getActiveBattle,
  castVote,
} from "../controllers/battleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveBattle);
router.post("/create", protect, createBattleController);
router.post("/:battleId/vote", protect, castVote);

export default router;
