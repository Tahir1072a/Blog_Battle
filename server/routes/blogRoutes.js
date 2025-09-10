import express from "express";
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlogById,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/myblogs").get(protect, getMyBlogs);
router.route("/").post(protect, createBlog).get(getAllBlogs);

router
  .route("/:id")
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;
