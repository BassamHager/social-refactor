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

module.exports = router;
