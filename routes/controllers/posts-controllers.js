const User = require("../../models/User");
const Post = require("../../models/Post");
const HttpError = require("../../util/error-model");
const { validationResult } = require("express-validator");

// 1- Add a post
const addPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
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
    return new HttpError("Server error!", 500);
  }
};

// 2- Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 3- Get post by id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return new HttpError("Post not found!", 404);
    }
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return new HttpError("Post not found!", 404);
    }
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 4- Delete post by id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return new HttpError("Post not found!", 404);
    }

    if (post.user.toString() !== req.user.id) {
      return new HttpError("User not authorized!", 403);
    }

    await post.remove();

    res.json({ msg: "post deleted!" });
  } catch (err) {
    if (err.kind == "ObjectId") {
      return new HttpError("Post not found!", 404);
    }
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 5- Like a post by id
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return new HttpError("Post not found!", 404);
    }

    // check if post has been liked already
    const likeCount = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (likeCount > 0) {
      return new HttpError("Post already liked!", 400);
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 6- Unlike a post by id
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return new HttpError("Post not found!", 404);
    }

    // check if post has been liked already
    const likeCount = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (likeCount === 0) {
      return new HttpError("Post not yet liked!", 400);
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 7- Add a comment to a specific post
const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId);

    if (!user) {
      return new HttpError("User not found!", 404);
    }

    if (!post) {
      return new HttpError("Post not found!", 404);
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
    return new HttpError("Server error!", 500);
  }
};

// 8- Delete a comment by postId & commentId
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return new HttpError("Post not found!", 404);
    }

    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.commentId
    );

    if (comment.user.toString() !== req.user.id) {
      return new HttpError("User unauthorized!", 403);
    }

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};
