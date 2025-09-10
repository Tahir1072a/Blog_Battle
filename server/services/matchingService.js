import Blog from "../models/Blog.js";
import Battle from "../models/Battle.js";

// Pooldan rastgele 2 tane blog yazısı seçer ve onları matchler...
export const createNewBattle = async () => {
  const availableBlogs = await Blog.find({ status: "in_pool" });

  if (availableBlogs.length < 2) {
    throw new Error("Eşleşme için yeterli blog yazısı bulunmuyor.");
  }

  const shuffledBlogs = availableBlogs.sort(() => 0.5 - Math.random());
  const blog1 = shuffledBlogs[0];
  const blog2 = shuffledBlogs[1];

  const newBattle = new Battle({
    blog1: blog1._id,
    blog2: blog2._id,
  });
  await newBattle.save();

  await Blog.findByIdAndUpdate(blog1._id, { status: "in_match" });
  await Blog.findByIdAndUpdate(blog2._id, { status: "in_match" });

  return newBattle;
};
