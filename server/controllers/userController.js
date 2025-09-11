import { catchAsync } from "../middleware/errorMiddleware.js";
import { calculateUserLevel } from "../services/levelService.js";
import Blog from "../models/Blog.js";
import Vote from "../models/Vote.js";

// @desc    Giriş yapmış kullanıcının profil bilgilerini getirir
// @route   GET /api/users/profile
export const getUserProfile = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const userId = req.user._id;

  const totalVotedBattles = await Vote.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalVotedBattles / limit);

  const [levelInfo, myBlogs, votedBattles] = await Promise.all([
    calculateUserLevel(userId),
    Blog.find({ author: userId }).sort({ createdAt: -1 }),
    Vote.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "battle",
        populate: [
          { path: "blog1", select: "title" },
          { path: "blog2", select: "title" },
          { path: "winner", select: "title" },
        ],
      }),
  ]);

  res.status(200).json({
    user: {
      ...req.user.toObject(),
      levelInfo,
    },
    myBlogs,
    votedBattles: {
      votes: votedBattles,
      page,
      totalPages,
    },
  });
});
