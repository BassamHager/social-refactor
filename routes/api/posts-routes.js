const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const {
  addPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} = require("../controllers/posts-controllers");

// @route   POST api/posts
// @access  Private
router.post("/", [auth, check("text", "Text is required!")], addPost);

// @route   GET api/posts
// @access  Private
router.get("/", auth, getAllPosts);

// @route   GET api/posts/:postId
// @access  Private
router.get("/:postId", auth, getPostById);

// @route   DELETE api/posts/:postId
// @access  Private
router.delete("/:postId", auth, deletePost);

// @route   PUT api/posts/like/:postId
// @access  Private
router.put("/like/:postId", auth, likePost);

// @route   PUT api/posts/unlike/:postId
// @access  Private
router.put("/unlike/:postId", auth, unlikePost);

// @route   PUT api/posts/comment/:postId
// @access  Private
router.put(
  "/comment/:postId",
  [auth, [check("text", "Text is required!").not().isEmpty()]],
  addComment
);

// @route   DELETE api/posts/comment/:postId/:commentId
// @access  Private
router.delete("/comment/:postId/:commentId", auth, deleteComment);

module.exports = router; // always authorize only the user to like, add a comment and to delete.
