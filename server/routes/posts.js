import express from "express";
import { getFeedPosts, getUserPosts, likePost, createPost, addCommentToPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/createPost", verifyToken, createPost);
router.post('/:id/addComment', verifyToken, addCommentToPost);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;