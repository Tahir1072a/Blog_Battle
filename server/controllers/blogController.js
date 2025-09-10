import Blog from "../models/Blog.js";
import mongoose from "mongoose";

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
    const blogs = await Blog.find({}).populate("author", "name");
    res.status(200).json(blogs);
  } catch (err) {
    console.error(error);
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
    const id = req.params.id; // Blog id

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Bu işlem için yetkiniz yok" });
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

    const blog = await Blog.findById(blogId).lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog Bulunamadı" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Bu işlem için yetkiniz yoktur" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog bşarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
