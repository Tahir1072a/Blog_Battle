import Battle from "../models/Battle.js";
import Blog from "../models/Blog.js";

/**
 * Bir savaşı sonlandırır, kazananı belirler, kazananın seviyesini artırır
 * ve her iki blogu da tekrar havuza gönderir.
 * @param {string} battleId - Sonlandırılacak savaşın ID'si.
 */
export const resolveBattle = async (battleId) => {
  const battle = await Battle.findById(battleId);

  if (!battle || battle.status === "finished") {
    return;
  }

  let winnerId = null;
  let loserId = null;

  if (battle.blog1Votes > battle.blog2Votes) {
    winnerId = battle.blog1;
    loserId = battle.blog2;
  } else if (battle.blog2Votes > battleblog1Votes) {
    winnerId = battle.blog2;
    loserId = battle.blog1;
  } else {
    await Blog.updateMany(
      { _id: { $in: [battle.blog1, battle.blog2] } },
      { $set: { status: "in_pool" } }
    );

    battle.status = "finished";
    await battle.save();
    console.log(`Battle ${battleId} ended in a draw.`);
    return;
  }

  await Blog.findByIdAndUpdate(winnerId, {
    $inc: { round: 1 },
    $set: { status: "in_pool" },
  });

  await Blog.findByIdAndUpdate(loserId, { $set: { status: "in_pool" } });

  battle.status = "finished";
  battle.winner = winnerId;
  await battle.save();

  console.log(
    `Battle ${battleId} finished. Winner: ${winnerId}, now at round ${
      (await Blog.findById(winnerId)).round
    }`
  );
  return battle;
};
