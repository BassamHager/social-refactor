const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// @route   POST api/posts
// @desc    Add a post
// @access  Private
router.post(
  "/",
  [auth, check("text", "Text is required!")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
    }

    try {
      const user = await (await User.findById(req.user.id)).isSelected(
        "-password"
      );

      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.log(err.message);
      return res.sendStatus(500).json("Server error!");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500).json("Server error!");
  }
});

// @route   GET api/posts/:postId
// @desc    Get post by id
// @access  Private
router.get("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }
    return res.sendStatus(500).json("Server error!");
  }
});

// @route   DELETE api/posts/:postId
// @desc    Delete post by id
// @access  Private
router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.sendStatus(401).json({ msg: "User not authorized!" });
    }

    await post.remove();

    res.json({ msg: "post deleted!" });
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }
    return res.sendStatus(500).json("Server error!");
  }
});

module.exports = router;
