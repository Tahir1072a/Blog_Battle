import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import { getBattleStats } from "../services/bracketService.js";
import { resolveBattle } from "../services/bracketService.js";
import { createNewBattle } from "../services/matchingService.js";
import { getLeaderboard } from "../services/levelService.js";

// @desc    Admin dashboard - genel istatistikler
// @route   GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      totalBattles,
      totalVotes,
      recentUsers,
      recentBlogs,
      battleStats,
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Battle.countDocuments(),
      Vote.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt level"),
      Blog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "name")
        .select("title author createdAt round"),
      getBattleStats(),
    ]);

    // Son 7 günün kullanıcı kayıt istatistikleri
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await User.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // En aktif kategoriler
    const topCategories = await Blog.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalRounds: { $sum: "$round" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totals: {
        users: totalUsers,
        blogs: totalBlogs,
        battles: totalBattles,
        votes: totalVotes,
      },
      recentActivity: {
        users: recentUsers,
        blogs: recentBlogs,
      },
      battleStats,
      weeklyStats,
      topCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kullanıcı yönetimi - tüm kullanıcıları listele
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-password");

    const total = await User.countDocuments(query);

    // Her kullanıcı için blog ve oy istatistikleri
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const [blogCount, voteCount, winCount] = await Promise.all([
          Blog.countDocuments({ author: user._id }),
          Vote.countDocuments({ user: user._id }),
          Battle.countDocuments({
            winner: { $exists: true },
            "winner.author": user._id,
          }),
        ]);

        return {
          ...user.toObject(),
          stats: {
            blogs: blogCount,
            votes: voteCount,
            wins: winCount,
          },
        };
      })
    );

    res.status(200).json({
      users: enrichedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kullanıcı detayları ve yönetim
// @route   GET /api/admin/users/:id
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const [blogs, votes, wonBattles, notifications] = await Promise.all([
      Blog.find({ author: user._id })
        .populate("author", "name")
        .sort({ createdAt: -1 }),
      Vote.find({ user: user._id })
        .populate("battle")
        .sort({ createdAt: -1 })
        .limit(10),
      Battle.find({ winner: { $exists: true } })
        .populate("winner")
        .then((battles) =>
          battles.filter(
            (battle) =>
              battle.winner &&
              battle.winner.author.toString() === user._id.toString()
          )
        ),
      Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(10),
    ]);

    res.status(200).json({
      user,
      activity: {
        blogs,
        votes,
        wonBattles,
        notifications,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kullanıcı rolünü güncelle
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Geçersiz rol" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Bildirim oluştur
    await Notification.create({
      user: user._id,
      message: `Hesap rolünüz ${
        role === "admin" ? "Admin" : "Kullanıcı"
      } olarak güncellendi.`,
      type: "role_change",
    });

    res.status(200).json({
      message: "Kullanıcı rolü başarıyla güncellendi",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
      // Manuel blog seçimi
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

      // Blog durumlarını güncelle
      await Blog.updateMany(
        { _id: { $in: [blog1Id, blog2Id] } },
        { $set: { status: "in_match" } }
      );
    } else {
      // Otomatik eşleşme
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

    // Her blog için savaş istatistikleri
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

// @desc    Blog durumunu güncelle (havuz/savaş)
// @route   PUT /api/admin/blogs/:id/status
export const updateBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["in_pool", "in_match", "archived"].includes(status)) {
      return res.status(400).json({ message: "Geçersiz durum" });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("author", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    res.status(200).json({
      message: "Blog durumu güncellendi",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sistem istatistikleri ve analitik
// @route   GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      userGrowth,
      blogGrowth,
      battleActivity,
      voteActivity,
      categoryStats,
      leaderboard,
    ] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Blog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Battle.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            created: { $sum: 1 },
            finished: {
              $sum: { $cond: [{ $eq: ["$status", "finished"] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Vote.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Blog.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgRound: { $avg: "$round" },
            maxRound: { $max: "$round" },
          },
        },
        { $sort: { count: -1 } },
      ]),
      getLeaderboard(10, "level"),
    ]);

    res.status(200).json({
      period: `${days} gün`,
      userGrowth,
      blogGrowth,
      battleActivity,
      voteActivity,
      categoryStats,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toplu işlemler - sahte oyları sıfırla
// @route   POST /api/admin/maintenance/reset-fake-votes
export const resetFakeVotes = async (req, res) => {
  try {
    // Bu işlem için daha kapsamlı validasyon gerekebilir
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
