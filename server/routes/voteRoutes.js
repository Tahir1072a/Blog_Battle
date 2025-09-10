import express from "express";
import { castVote, getMyVotedBattles } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, castVote);
router.get("/my-votes", protect, getMyVotedBattles);

export default router;
