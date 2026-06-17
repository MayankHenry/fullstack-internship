const express = require("express");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const Post = require("../models/Post");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, tag, author } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch post" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      tags: tags || [],
      author: req.user.id
    });

    const populated = await post.populate("author", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not create post" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;

    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || content?.substring(0, 150) || post.excerpt;
    post.tags = tags || post.tags;

    await post.save();
    const populated = await post.populate("author", "name email");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not update post" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });

    if (!post) {
      return res.status(404).json({ message: "Post not found or not authorized" });
    }

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete post" });
  }
});

module.exports = router;
