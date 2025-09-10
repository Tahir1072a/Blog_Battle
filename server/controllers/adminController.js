import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";
import { resolveBattle } from "../services/bracketService.js";
import { createNewBattle } from "../services/matchingService.js";

// @desc    Kullanıcı yönetimi - tüm kullanıcıları listele
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();

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

// @desc    Savaş yönetimi - aktif savaşlar
// @route   GET /api/admin/battles
export const getAllBattles = async (req, res) => {
  try {
    const status = req.query.status || "active";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const battles = await Battle.find({ status })
      .populate([
        { path: "blog1", populate: { path: "author", select: "name" } },
        { path: "blog2", populate: { path: "author", select: "name" } },
        { path: "winner", populate: { path: "author", select: "name" } },
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Battle.countDocuments({ status });

    res.status(200).json({
      battles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Savaşı manuel olarak sonlandır
// @route   POST /api/admin/battles/:id/resolve
export const resolveBattleManually = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Yeni savaş oluştur
// @route   POST /api/admin/battles/create
export const createBattleManually = async (req, res) => {
  try {
    const { blog1Id, blog2Id, voteLimit, durationMinutes } = req.body;

    let battle;

    if (blog1Id && blog2Id) {
      const [blog1, blog2] = await Promise.all([
        Blog.findById(blog1Id),
        Blog.findById(blog2Id),
      ]);

      if (!blog1 || !blog2) {
        return res.status(404).json({ message: "Seçilen bloglar bulunamadı" });
      }

      if (blog1.status !== "in_pool" || blog2.status !== "in_pool") {
        return res
          .status(400)
          .json({ message: "Seçilen bloglar zaten savaşta" });
      }

      const endsAt = new Date();
      endsAt.setMinutes(endsAt.getMinutes() + (durationMinutes || 10));

      battle = new Battle({
        blog1: blog1Id,
        blog2: blog2Id,
        voteLimit: voteLimit || 10,
        endsAt,
      });

      await battle.save();

      await Blog.updateMany(
        { _id: { $in: [blog1Id, blog2Id] } },
        { $set: { status: "in_match" } }
      );
    } else {
      battle = await createNewBattle();
    }

    const populatedBattle = await Battle.findById(battle._id).populate([
      { path: "blog1", populate: { path: "author", select: "name" } },
      { path: "blog2", populate: { path: "author", select: "name" } },
    ]);

    res.status(201).json({
      message: "Yeni savaş başarıyla oluşturuldu",
      battle: populatedBattle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Blog yönetimi - tüm bloglar
// @route   GET /api/admin/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const status = req.query.status;
    const search = req.query.search;

    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    const enrichedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const [battlesCount, winsCount] = await Promise.all([
          Battle.countDocuments({
            $or: [{ blog1: blog._id }, { blog2: blog._id }],
          }),
          Battle.countDocuments({ winner: blog._id }),
        ]);

        return {
          ...blog.toObject(),
          stats: {
            battles: battlesCount,
            wins: winsCount,
            winRate:
              battlesCount > 0
                ? ((winsCount / battlesCount) * 100).toFixed(1)
                : 0,
          },
        };
      })
    );

    res.status(200).json({
      blogs: enrichedBlogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toplu işlemler - sahte oyları sıfırla
// @route   POST /api/admin/maintenance/reset-fake-votes
export const resetFakeVotes = async (req, res) => {
  try {
    const { battleIds, resetAll } = req.body;

    let query = {};
    if (!resetAll && battleIds && battleIds.length > 0) {
      query._id = { $in: battleIds };
    }

    const result = await Battle.updateMany(query, {
      $set: {
        blog1Votes: 0,
        blog2Votes: 0,
      },
    });

    // İlgili vote kayıtlarını da sil
    if (resetAll) {
      await Vote.deleteMany({});
    } else if (battleIds && battleIds.length > 0) {
      await Vote.deleteMany({ battle: { $in: battleIds } });
    }

    res.status(200).json({
      message: `${result.modifiedCount} savaşın oyları sıfırlandı`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
