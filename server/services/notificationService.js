import Notification from "../models/Notification.js";

/**
 * Genel bir bildirim oluşturma fonksiyonu
 * @param {string} userId - Bildirimi alacak kullanıcı ID'si
 * @param {string} message - Bildirim mesajı
 */
const createNotification = async (userId, message) => {
  try {
    if (!userId || !message) return;
    await Notification.create({ user: userId, message });
  } catch (error) {
    console.error("Bildirim oluşturulurken hata:", error);
  }
};

export const sendBattleStartNotification = async (blog1, blog2) => {
  await createNotification(
    blog1.author,
    `"**${blog1.title}**" başlıklı yazın, "**${blog2.title}**" başlıklı yazı ile savaşa girdi!`
  );
  await createNotification(
    blog2.author,
    `"**${blog2.title}**" başlıklı yazın, "**${blog1.title}**" başlıklı yazı ile savaşa girdi!`
  );
};

export const sendBattleResultNotifications = async (winnerBlog, loserBlog) => {
  await createNotification(
    winnerBlog.author,
    `🎉 Tebrikler! "**${winnerBlog.title}**" başlıklı yazınız savaşı kazandı ve ${winnerBlog.round}. seviyeye yükseldi!`
  );
  await createNotification(
    loserBlog.author,
    `"**${loserBlog.title}**" başlıklı yazınız savaşı kaybetti, ancak havuzda yeni fırsatlar sizi bekliyor!`
  );
};

export const sendLevelUpNotification = async (userId, levelName, badge) => {
  await createNotification(
    userId,
    `🎉 Tebrikler! Seviye atladınız: ${badge} ${levelName}`
  );
};

export const sendDrawNotifications = async (battle) => {
  const blog1 = await battle.blog1.populate("author");
  const blog2 = await battle.blog2.populate("author");

  await createNotification(
    blog1.author._id,
    `"**${blog1.title}**" başlıklı yazınızın savaşı berabere bitti. Yeni bir şans için havuzda bekliyor!`
  );
  await createNotification(
    blog2.author._id,
    `"**${blog2.title}**" başlıklı yazınızın savaşı berabere bitti. Yeni bir şans için havuzda bekliyor!`
  );
};
