import Battle from "../models/Battle.js";
import Blog from "../models/Blog.js";
import { checkAndHandleLevelUp } from "./levelService.js";
import {
  sendBattleResultNotifications,
  sendDrawNotifications,
} from "./notificationService.js";
import { createNewBattle } from "./matchingService.js";

/**
 * Bir savaşı sonlandırır, kazananı belirler, kazananın seviyesini artırır
 * ve her iki blogu da tekrar havuza gönderir.
 * @param {string} battleId - Sonlandırılacak savaşın ID'si.
 */
export const resolveBattle = async (battleId) => {
  try {
    const battle = await Battle.findById(battleId).populate([
      { path: "blog1", model: "Blog" },
      { path: "blog2", model: "Blog" },
    ]);

    if (!battle || battle.status === "finished") {
      console.log(`Battle ${battleId} already finished or not found.`);
      return null;
    }

    let winnerId = null;
    let loserId = null;
    let winnerBlog = null;
    let loserBlog = null;

    if (battle.blog1Votes > battle.blog2Votes) {
      winnerId = battle.blog1._id;
      loserId = battle.blog2._id;
      winnerBlog = battle.blog1;
      loserBlog = battle.blog2;
    } else if (battle.blog2Votes > battle.blog1Votes) {
      winnerId = battle.blog2._id;
      loserId = battle.blog1._id;
      winnerBlog = battle.blog2;
      loserBlog = battle.blog1;
    } else {
      await Blog.updateMany(
        { _id: { $in: [battle.blog1._id, battle.blog2._id] } },
        { $set: { status: "in_pool" } }
      );

      battle.status = "finished";
      await battle.save();

      await sendDrawNotifications(battle);

      console.log(`Battle ${battleId} ended in a draw.`);
      return battle;
    }

    const updatedWinner = await Blog.findByIdAndUpdate(
      winnerId,
      {
        $inc: { round: 1 },
        $set: { status: "in_pool" },
      },
      { new: true }
    );

    await Blog.findByIdAndUpdate(loserId, {
      $set: { status: "in_pool" },
    });

    battle.status = "finished";
    battle.winner = winnerId;
    await battle.save();

    if (winnerBlog && winnerBlog.author) {
      await checkAndHandleLevelUp(winnerBlog.author);
    }

    await sendBattleResultNotifications(
      winnerBlog,
      loserBlog,
      updatedWinner.round
    );

    await checkAndCreateNewBattles();

    console.log(
      `Battle ${battleId} finished. Winner: ${winnerBlog.title} (${winnerBlog.author.name}), new round: ${updatedWinner.round}`
    );

    return battle;
  } catch (error) {
    console.error(`Error resolving battle ${battleId}:`, error);
    throw error;
  }
};

/**
 * Zamanı dolmuş aktif savaşları otomatik olarak sonlandırır
 */
export const resolveExpiredBattles = async () => {
  try {
    const expiredBattles = await Battle.find({
      status: "active",
      endsAt: { $lt: new Date() },
    });

    console.log(`Found ${expiredBattles.length} expired battles to resolve.`);

    for (const battle of expiredBattles) {
      await resolveBattle(battle._id);
    }

    return expiredBattles.length;
  } catch (error) {
    console.error("Error resolving expired battles:", error);
    throw error;
  }
};

/**
 * Aktif savaş sayısını kontrol eder ve gerekirse yenilerini oluşturur
 */
export const checkAndCreateNewBattles = async () => {
  try {
    const activeBattleCount = await Battle.countDocuments({ status: "active" });
    const MIN_ACTIVE_BATTLES = 2;

    if (activeBattleCount < MIN_ACTIVE_BATTLES) {
      const battlesToCreate = MIN_ACTIVE_BATTLES - activeBattleCount;

      for (let i = 0; i < battlesToCreate; i++) {
        try {
          await createNewBattle();
          console.log(
            `New battle created automatically (${i + 1}/${battlesToCreate})`
          );
        } catch (error) {
          console.log(`Could not create battle ${i + 1}: ${error.message}`);
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error checking and creating new battles:", error);
  }
};

/**
 * Belirli bir seviyedeki aktif savaşları getirir (Admin panel için)
 */
export const getBattlesByRound = async (round) => {
  try {
    return await Battle.find({ status: "active" }).populate([
      {
        path: "blog1",
        match: { round: round },
        select: "title round author category",
      },
      {
        path: "blog2",
        match: { round: round },
        select: "title round author category",
      },
    ]);
  } catch (error) {
    console.error(`Error getting battles for round ${round}:`, error);
    throw error;
  }
};

/**
 * Savaş istatistiklerini getirir (Admin dashboard için)
 */
export const getBattleStats = async () => {
  try {
    const [activeBattles, finishedBattles, totalVotes] = await Promise.all([
      Battle.countDocuments({ status: "active" }),
      Battle.countDocuments({ status: "finished" }),
      Battle.aggregate([
        { $match: { status: "finished" } },
        {
          $group: {
            _id: null,
            totalVotes: { $sum: { $add: ["$blog1Votes", "$blog2Votes"] } },
          },
        },
      ]),
    ]);

    return {
      activeBattles,
      finishedBattles,
      totalVotes: totalVotes[0]?.totalVotes || 0,
    };
  } catch (error) {
    console.error("Error getting battle stats:", error);
    throw error;
  }
};
