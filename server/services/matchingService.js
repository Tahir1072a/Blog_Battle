import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";
import Notification from "../models/Notification.js";

const VOTE_LIMIT = 10;
const BATTLE_DURATION_MINUTES = 10;

// Pooldan rastgele 2 tane blog yazısı seçer ve onları matchler...
export const createNewBattle = async () => {
  const availableBlogs = await Blog.find({ status: "in_pool" });

  if (availableBlogs.length < 2) {
    throw new Error("Eşleşme için yeterli blog yazısı bulunmuyor.");
  }

  const blogsByRound = availableBlogs.reduce((acc, blog) => {
    acc[blog.round] = acc[blog.round] || [];
    acc[blog.round].push(blog);
    return acc;
  }, {});

  let selectedRound = null;
  for (const round in blogsByRound) {
    if (blogsByRound[round].length >= 2) {
      selectedRound = round;
      break;
    }
  }

  if (selectedRound === null) {
    throw new Error(
      "Eşleşme için aynı seviyede yeterli blog yazısı bulunmuyor."
    );
  }

  const candidates = blogsByRound[selectedRound];
  const shuffledBlogs = candidates.sort(() => 0.5 - Math.random());
  const [blog1, blog2] = shuffledBlogs.slice(0, 2);

  const endsAt = new Date();
  endsAt.setMinutes(endsAt.getMinutes() + BATTLE_DURATION_MINUTES);

  const newBattle = new Battle({
    blog1: blog1._id,
    blog2: blog2._id,
    voteLimit: VOTE_LIMIT,
    endsAt: endsAt,
  });
  await newBattle.save();

  await Notification.create({
    user: blog1.author,
    message: `"${blog1.title}" başlıklı yazın, ${blog2.title}" başlıklı yazı ile savaşa girdi!`,
  });

  await Notification.create({
    user: blog2.author,
    message: `"${blog2.title}" başlıklı yazın, "${blog1.title}" başlıklı yazı ile savaşa girdi!`,
  });

  await Blog.findByIdAndUpdate(blog1._id, { status: "in_match" });
  await Blog.findByIdAndUpdate(blog2._id, { status: "in_match" });

  return newBattle;
};
