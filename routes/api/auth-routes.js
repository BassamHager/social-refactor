const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  getAuthUser,
  getUserToken,
} = require("../controllers/auth-controllers");

// @route   GET api/auth
// @access  Public
router.get("/", auth, getAuthUser);

// @route   POST api/auth
// @access  Public
router.post(
  "/",
  [
    check("email", "insert a valid email").normalizeEmail().isEmail(),
    check("password", "password is required!").exists(),
  ],
  getUserToken
);

module.exports = router;
