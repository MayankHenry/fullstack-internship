const express = require("express");
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch comments" });
  }
});

router.post("/:postId", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      text: text.trim(),
      post: req.params.postId,
      author: req.user.id
    });

    const populated = await comment.populate("author", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not add comment" });
  }
});

router.delete("/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      author: req.user.id
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or not authorized" });
    }

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete comment" });
  }
});

module.exports = router;
