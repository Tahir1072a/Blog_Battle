import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Başlık en az 10 karakter olmalıdır."],
      maxlength: [150, "Başlık en fazla 150 karakter olabilir."],
    },
    content: {
      type: String,
      required: [true, "İçerik alanı zorunludur."],
      minlength: [50, "İçerik en az 50 karakter olmalıdır."],
    },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["in_pool", "in_match"],
      default: "in_pool",
    },

    round: {
      type: String,
      default: 1,
    },
  },
  { timestamps: true }
);

// 'author' ve 'title' alanlarının kombinasyonunun benzersiz olmalı!!!
BlogSchema.index({ author: 1, title: 1 }, { unique: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
