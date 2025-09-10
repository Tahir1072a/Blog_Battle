import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";
import { resolveBattle } from "../services/bracketService.js";
import { createNewBattle } from "../services/matchingService.js";

// @desc    Kullanıcı yönetimi - tüm kullanıcıları listele
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

  // Her kullanıcı için basit istatistikler
  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const blogCount = await Blog.countDocuments({ author: user._id });
      return {
        ...user,
        blogCount,
      };
    })
  );

  res.status(200).json(enrichedUsers);
};

// @desc    Savaş yönetimi - tüm savaşları durumuna göre listele
// @route   GET /api/admin/battles
export const getAllBattles = async (req, res) => {
  const status = req.query.status || "active"; // active, finished, archived

  const battles = await Battle.find({ status }).populate([
    { path: "blog1", select: "title" },
    { path: "blog2", select: "title" },
    { path: "winner", select: "title" },
  ]);

  res.status(200).json(battles);
};

// @desc    Savaşı manuel olarak sonlandır
// @route   POST /api/admin/battles/:id/resolve
export const resolveBattleManually = async (req, res) => {
  const battle = await resolveBattle(req.params.id);

  if (!battle) {
    return res
      .status(404)
      .json({ message: "Savaş bulunamadı veya zaten bitmişti" });
  }

  res.status(200).json({
    message: "Savaş başarıyla sonlandırıldı",
    battle,
  });
};

// @desc    Yeni bir savaşı manuel olarak tetikle (otomatik eşleşme)
// @route   POST /api/admin/battles/create
export const createBattleManually = async (req, res) => {
  const battle = await createNewBattle();
  const populatedBattle = await Battle.findById(battle._id).populate([
    { path: "blog1", select: "title" },
    { path: "blog2", select: "title" },
  ]);

  res.status(201).json({
    message: "Yeni savaş başarıyla oluşturuldu",
    battle: populatedBattle,
  });
};
