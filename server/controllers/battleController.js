import { createNewBattle } from "../services/matchingService.js";
import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";

// @desc    Yeni bir savaş oluşturur
// @route   POST /api/battles/create
export const createBattleController = async (req, res) => {
  try {
    const battle = await createNewBattle();
    res
      .status(201)
      .json({ message: "Yeni savaş başarıyla oluşturuldu.", battle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Oylama için aktif bir savaş getirir
// @route   GET /api/battles/active
export const getActiveBattle = async (req, res) => {
  try {
    const activeBattles = await Battle.find({ status: "active" });

    if (activeBattles.length === 0) {
      return res.status(404).json({ message: "Aktif savaş bulunmuyor" });
    }

    const randomBattle =
      activeBattles[Math.floor(Math.random() * activeBattles.length)];

    await randomBattle.populate([
      { path: "blog1", select: "title content imageUrl author category" },
      { path: "blog2", select: "title content imageUrl author category" },
    ]);

    res.status(200).json(randomBattle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Bir savaşa oy verir
// @route   POST /api/battles/:battleId/vote
export const castVote = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { blogId } = req.body;
    const userId = req.user._id;

    const existingVote = await Vote.findOne({
      user: userId,
      battle: battleId,
    });
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "Bu savaşa zaten oy kullandınız." });
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Savaş bulunamadı." });
    }
    if (battle.status !== "active") {
      return res.status(400).json({ message: "Bu savaş artık aktif değil." });
    }

    if (battle.blog1.toString() === blogId.toString()) {
      battle.blog1Votes += 1;
    } else if (battle.blog2.toString() === blogId.toString()) {
      battle.blog2Votes += 1;
    } else {
      return res.status(400).json({ message: "Geçersiz blog ID'si" });
    }

    await battle.save();

    const newVote = new Vote({
      user: userId,
      battle: battleId,
      votedFor: blogId,
    });

    await newVote.save();

    const populatedBattle = await Battle.findById(battleId).populate([
      { path: "blog1", select: "title content imageUrl author category" },
      { path: "blog2", select: "title content imageUrl author category" },
    ]);

    res.status(200).json(populatedBattle);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Oylama sırasında bir hata oluştu" + err.message });
  }
};
