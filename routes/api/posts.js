const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");

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
      return res.sendStatus(500).send("Server error!");
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
    return res.sendStatus(500).send("Server error!");
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
    return res.sendStatus(500).send("Server error!");
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
    return res.sendStatus(500).send("Server error!");
  }
});

// @route   PUT api/posts/like/:postId
// @desc    Like a post by id
// @access  Private
router.put("/like/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }

    // check if post has been liked already
    const likeCount = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (likeCount > 0) {
      return res.status(400).json({ msg: "Post already liked!" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500).send("Server error!");
  }
});

// @route   PUT api/posts/unlike/:postId
// @desc    Unlike a post by id
// @access  Private
router.put("/unlike/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }

    // check if post has been liked already
    const likeCount = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (likeCount === 0) {
      return res.status(400).json({ msg: "Post not yet liked!" });
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500).send("Server error!");
  }
});

// @route   PUT api/posts/comment/:postId
// @desc    Add a comment to a specific post
// @access  Private
router.put(
  "/comment/:postId",
  [auth, [check("text", "Text is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.postId);
      if (!user) {
        return res.sendStatus(404).json({ msg: "User not found!" });
      }
      if (!post) {
        return res.sendStatus(404).json({ msg: "Post not found!" });
      }

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      return res.sendStatus(500).send("Server error!");
    }
  }
);

// @route   DELETE api/posts/comment/:postId/:commentId
// @desc    Delete a comment by postId & commentId
// @access  Private
router.delete("/comment/:postId/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.sendStatus(404).json({ msg: "Post not found!" });
    }

    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.commentId
    );

    if (comment.user.toString() !== req.user.id) {
      return res.sendStatus(401).json({ msg: "User not authorized!" });
    }

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(400).send("Server error!");
  }
});

module.exports = router; // always authorize only the user to like, add a comment and to delete.
