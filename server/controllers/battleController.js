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
