import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import Battle from "../models/Battle.js";
import Notification from "../models/Notification.js";

import { resolveBattle } from "../services/bracketService.js";

// @desc    Yeni bir blog yazısı oluşturur
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;

    const blog = new Blog({
      title,
      content,
      imageUrl,
      category,
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

// @desc    Tüm blog yazılarını getirir
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category, limit, exclude } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (exclude) {
      filter._id = { $ne: exclude };
    }

    let query = Blog.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const blogs = await query;

    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Blog bulunamadı." });
    }

    const blog = await Blog.findById(id).populate("author", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı." });
    }

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Bir blog yazısını günceller
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;
    const id = req.params.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Bu işlem için yetkiniz yok" });
    }

    if (blog.status === "in_match") {
      const activeBattle = await Battle.findOne({
        $or: [{ blog1: id }, { blog2: id }],
        status: "active",
      });

      if (activeBattle) {
        const winnerId = activeBattle.blog1.equals(id)
          ? activeBattle.blog2
          : activeBattle.blog1;

        activeBattle.blog1Votes = activeBattle.blog1.equals(winnerId) ? 1 : 0;
        activeBattle.blog2Votes = activeBattle.blog2.equals(winnerId) ? 1 : 0;
        await activeBattle.save();

        await resolveBattle(activeBattle._id);
        console.log(
          `Blog güncellendiği için Savaş #${activeBattle._id} sonlandırıldı.`
        );
      }
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.imageUrl = imageUrl || blog.imageUrl;
    blog.category = category || blog.category;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc    Bir blog yazısını siler
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog Bulunamadı" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Bu işlem için yetkiniz yoktur" });
    }

    if (blog.status === "in_match") {
      const activeBattle = await Battle.findOne({
        $or: [{ blog1: blogId }, { blog2: blogId }],
        status: "active",
      });

      if (activeBattle) {
        const winnerBlogId = activeBattle.blog1.equals(blogId)
          ? activeBattle.blog2
          : activeBattle.blog1;

        await Blog.findByIdAndUpdate(winnerBlogId, {
          $inc: { round: 1 },
          $set: { status: "in_pool" },
        });

        activeBattle.status = "finished";
        activeBattle.winner = winnerBlogId;
        await activeBattle.save();

        const winnerBlog = await Blog.findById(winnerBlogId);

        if (winnerBlog && winnerBlog.author) {
          await Notification.create({
            user: winnerBlog.author,
            message: `🎉 Rakibiniz yazısını sildiği için "**${winnerBlog.title}**" başlıklı yazınız savaşı otomatik olarak kazandı!`,
          });
        }
      }
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({
      message: "Blog başarıyla silindi ve ilgili savaş sonlandırıldı.",
    });
  } catch (err) {
    console.error("Blog silme hatası:", err);
    res
      .status(500)
      .json({ message: "Blog silinirken bir hata oluştu: " + err.message });
  }
};
