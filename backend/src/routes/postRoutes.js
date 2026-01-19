import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);        // CREATE
router.get("/", protect, getPosts);           // READ ALL
router.get("/:id", protect, getPostById);     // READ ONE
router.put("/:id", protect, updatePost);      // UPDATE
router.delete("/:id", protect, deletePost);   // DELETE

export default router;
