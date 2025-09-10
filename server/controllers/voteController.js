import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";
import { resolveBattle } from "../services/bracketService.js";

// @desc    Bir savaşa oy verir
// @route   POST /api/votes
export const castVote = async (req, res) => {
  try {
    const { battleId, blogId } = req.body;
    const userId = req.user._id;

    const existingVote = await Vote.findOne({ user: userId, battle: battleId });
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "Bu savaşa zaten oy kullandınız." });
    }

    const battle = await Battle.findById(battleId);
    if (!battle || battle.status !== "active") {
      return res
        .status(400)
        .json({ message: "Oylanacak aktif bir savaş bulunamadı." });
    }

    let totalVotes = battle.blog1Votes + battle.blog2Votes;
    if (battle.blog1.toString() === blogId) {
      battle.blog1Votes += 1;
    } else if (battle.blog2.toString() === blogId) {
      battle.blog2Votes += 1;
    } else {
      return res.status(400).json({ message: "Geçersiz blog ID'si." });
    }
    totalVotes += 1;
    await battle.save();

    const newVote = new Vote({
      user: userId,
      battle: battleId,
      votedFor: blogId,
    });
    await newVote.save();

    if (battle.voteLimit && totalVotes >= battle.voteLimit) {
      await resolveBattle(battleId);
    }

    const populatedBattle = await Battle.findById(battleId).populate([
      { path: "blog1", model: "Blog" },
      { path: "blog2", model: "Blog" },
    ]);

    res.status(200).json(populatedBattle);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Oylama sırasında bir hata oluştu: " + error.message });
  }
};

// @desc    Giriş yapmış kullanıcının oyladığı savaşları getirir
// @route   GET /api/votes/my-votes
export const getMyVotedBattles = async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "battle",
        populate: [
          { path: "blog1", model: "Blog" },
          { path: "blog2", model: "Blog" },
          { path: "winner", model: "Blog" },
        ],
      });

    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Oylar alınamadı: " + error.message });
  }
};
