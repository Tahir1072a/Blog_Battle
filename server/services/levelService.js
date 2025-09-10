import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Vote from "../models/Vote.js";

/**
 * Kullanıcı seviyelendirme sistemi
 */

// Seviye tanımları
export const USER_LEVELS = {
  1: { name: "Çaylak", minPosts: 0, minWins: 0, badge: "🌱", color: "gray" },
  2: {
    name: "Köşe Yazarı",
    minPosts: 3,
    minWins: 2,
    badge: "✍️",
    color: "blue",
  },
  3: {
    name: "Usta Kalem",
    minPosts: 10,
    minWins: 8,
    badge: "🖋️",
    color: "purple",
  },
  4: {
    name: "Efsane Yazar",
    minPosts: 25,
    minWins: 20,
    badge: "👑",
    color: "gold",
  },
  5: {
    name: "Blog Efsanesi",
    minPosts: 50,
    minWins: 40,
    badge: "🏆",
    color: "rainbow",
  },
};

// Blog seviyeleri (round bazlı)
export const BLOG_LEVELS = {
  1: { name: "Yeni", badge: null, color: "gray" },
  2: { name: "Deneyimli", badge: null, color: "blue" },
  3: { name: "Yükselen Yıldız", badge: "⭐", color: "yellow" },
  4: { name: "Popüler", badge: "🔥", color: "orange" },
  5: { name: "Usta Yazar", badge: "💎", color: "blue" },
  6: { name: "Elite", badge: "⚡", color: "purple" },
  7: { name: "Şampiyon", badge: "🏅", color: "gold" },
  8: { name: "Efsane", badge: "🌟", color: "rainbow" },
  9: { name: "Ölümsüz", badge: "👑", color: "divine" },
  10: { name: "Efsane Kalem", badge: "🏆", color: "legendary" },
};

/**
 * Kullanıcının mevcut istatistiklerini hesaplar
 */
export const calculateUserStats = async (userId) => {
  try {
    const [userBlogs, winStats, voteStats] = await Promise.all([
      // Kullanıcının blog sayısı
      Blog.countDocuments({ author: userId }),

      // Kazanılan savaş sayısı
      Blog.aggregate([
        { $match: { author: userId } },
        {
          $lookup: {
            from: "battles",
            localField: "_id",
            foreignField: "winner",
            as: "wonBattles",
          },
        },
        {
          $group: {
            _id: null,
            totalWins: { $sum: { $size: "$wonBattles" } },
            maxRound: { $max: "$round" },
          },
        },
      ]),

      // Oy verme istatistikleri
      Vote.countDocuments({ user: userId }),
    ]);

    const totalPosts = userBlogs;
    const totalWins = winStats[0]?.totalWins || 0;
    const maxBlogRound = winStats[0]?.maxRound || 1;
    const totalVotes = voteStats;

    return {
      totalPosts,
      totalWins,
      totalVotes,
      maxBlogRound,
      winRate: totalPosts > 0 ? ((totalWins / totalPosts) * 100).toFixed(1) : 0,
    };
  } catch (error) {
    console.error("Error calculating user stats:", error);
    throw error;
  }
};

/**
 * Kullanıcının mevcut seviyesini hesaplar
 */
export const calculateUserLevel = async (userId) => {
  try {
    const stats = await calculateUserStats(userId);
    let userLevel = 1;

    // En yüksek seviyeyi bul
    for (let level = Object.keys(USER_LEVELS).length; level >= 1; level--) {
      const requirements = USER_LEVELS[level];
      if (
        stats.totalPosts >= requirements.minPosts &&
        stats.totalWins >= requirements.minWins
      ) {
        userLevel = level;
        break;
      }
    }

    return {
      level: userLevel,
      ...USER_LEVELS[userLevel],
      stats,
      nextLevel: USER_LEVELS[userLevel + 1] || null,
    };
  } catch (error) {
    console.error("Error calculating user level:", error);
    throw error;
  }
};

/**
 * Blog seviyesi bilgisini getirir
 */
export const getBlogLevel = (round) => {
  const level = Math.min(round, Object.keys(BLOG_LEVELS).length);
  return {
    round,
    level,
    ...BLOG_LEVELS[level],
  };
};

/**
 * Seviye atlama kontrolü yapar ve bildirim gönderir
 */
export const checkLevelUp = async (userId) => {
  try {
    const User = (await import("../models/User.js")).default;
    const Notification = (await import("../models/Notification.js")).default;

    const user = await User.findById(userId);
    if (!user) return null;

    const currentUserLevel = await calculateUserLevel(userId);
    const previousLevel = user.level || 1;

    // Seviye atladı mı?
    if (currentUserLevel.level > previousLevel) {
      // Kullanıcının seviyesini güncelle
      await User.findByIdAndUpdate(userId, {
        level: currentUserLevel.level,
        lastLevelUp: new Date(),
      });

      // Seviye atlama bildirimi gönder
      await Notification.create({
        user: userId,
        message: `🎉 Tebrikler! ${currentUserLevel.badge} "${currentUserLevel.name}" seviyesine yükseldiniz!`,
        type: "level_up",
      });

      console.log(
        `User ${user.name} leveled up from ${previousLevel} to ${currentUserLevel.level}`
      );

      return {
        leveledUp: true,
        previousLevel,
        newLevel: currentUserLevel.level,
        levelInfo: currentUserLevel,
      };
    }

    return {
      leveledUp: false,
      currentLevel: previousLevel,
      levelInfo: currentUserLevel,
    };
  } catch (error) {
    console.error("Error checking level up:", error);
    throw error;
  }
};

/**
 * Leaderboard verileri getirir
 */
export const getLeaderboard = async (limit = 10, type = "level") => {
  try {
    let sortCriteria;
    let pipeline = [
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "blogs",
        },
      },
    ];

    switch (type) {
      case "level":
        pipeline.push({ $sort: { level: -1, createdAt: 1 } });
        break;
      case "wins":
        pipeline.push(
          {
            $lookup: {
              from: "battles",
              let: { userId: "$_id" },
              pipeline: [
                {
                  $lookup: {
                    from: "blogs",
                    localField: "winner",
                    foreignField: "_id",
                    as: "winnerBlog",
                  },
                },
                {
                  $match: {
                    $expr: {
                      $eq: [
                        { $arrayElemAt: ["$winnerBlog.author", 0] },
                        "$$userId",
                      ],
                    },
                  },
                },
              ],
              as: "wins",
            },
          },
          { $addFields: { totalWins: { $size: "$wins" } } },
          { $sort: { totalWins: -1, level: -1 } }
        );
        break;
      case "posts":
        pipeline.push(
          { $addFields: { totalPosts: { $size: "$blogs" } } },
          { $sort: { totalPosts: -1, level: -1 } }
        );
        break;
    }

    pipeline.push(
      { $limit: limit },
      {
        $project: {
          name: 1,
          email: 1,
          level: 1,
          createdAt: 1,
          totalPosts: { $size: "$blogs" },
          ...(type === "wins" && { totalWins: 1 }),
        },
      }
    );

    const User = (await import("../models/User.js")).default;
    const leaderboard = await User.aggregate(pipeline);

    // Seviye bilgilerini ekle
    const enrichedLeaderboard = await Promise.all(
      leaderboard.map(async (user) => {
        const userLevel = await calculateUserLevel(user._id);
        return {
          ...user,
          levelInfo: userLevel,
        };
      })
    );

    return enrichedLeaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};

/**
 * Kullanıcının genel istatistiklerini getirir (profil için)
 */
export const getUserProfile = async (userId) => {
  try {
    const User = (await import("../models/User.js")).default;

    const [user, userLevel, stats] = await Promise.all([
      User.findById(userId).select("-password"),
      calculateUserLevel(userId),
      calculateUserStats(userId),
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    // Son aktivite
    const Vote = (await import("../models/Vote.js")).default;
    const lastVote = await Vote.findOne({ user: userId }).sort({
      createdAt: -1,
    });
    const lastPost = await Blog.findOne({ author: userId }).sort({
      createdAt: -1,
    });

    let lastActivity = null;
    if (lastVote && lastPost) {
      lastActivity =
        lastVote.createdAt > lastPost.createdAt
          ? lastVote.createdAt
          : lastPost.createdAt;
    } else if (lastVote) {
      lastActivity = lastVote.createdAt;
    } else if (lastPost) {
      lastActivity = lastPost.createdAt;
    }

    return {
      user: {
        ...user.toObject(),
        levelInfo: userLevel,
      },
      stats: {
        ...stats,
        lastActivity,
      },
      achievements: await getUserAchievements(userId, stats),
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Kullanıcının başarımlarını hesaplar
 */
const getUserAchievements = async (userId, stats) => {
  const achievements = [];

  // İlk yazı başarımı
  if (stats.totalPosts >= 1) {
    achievements.push({
      id: "first_post",
      name: "İlk Adım",
      description: "İlk blog yazınızı yayınladınız",
      badge: "📝",
      unlocked: true,
    });
  }

  // İlk zafer
  if (stats.totalWins >= 1) {
    achievements.push({
      id: "first_win",
      name: "İlk Zafer",
      description: "İlk savaşınızı kazandınız",
      badge: "🏆",
      unlocked: true,
    });
  }

  // Oy verme başarımları
  if (stats.totalVotes >= 10) {
    achievements.push({
      id: "voter",
      name: "Aktif Jüri",
      description: "10 savaşa oy verdiniz",
      badge: "🗳️",
      unlocked: true,
    });
  }

  if (stats.totalVotes >= 50) {
    achievements.push({
      id: "super_voter",
      name: "Süper Jüri",
      description: "50 savaşa oy verdiniz",
      badge: "⚖️",
      unlocked: true,
    });
  }

  // Yazı sayısı başarımları
  if (stats.totalPosts >= 5) {
    achievements.push({
      id: "prolific",
      name: "Üretken Yazar",
      description: "5 blog yazısı yayınladınız",
      badge: "📚",
      unlocked: true,
    });
  }

  // Yüksek round başarımı
  if (stats.maxBlogRound >= 5) {
    achievements.push({
      id: "champion",
      name: "Şampiyon",
      description: "Bir yazınız 5. seviyeye ulaştı",
      badge: "👑",
      unlocked: true,
    });
  }

  return achievements;
};
