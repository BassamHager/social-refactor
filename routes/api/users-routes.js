const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { registerUser } = require("../controllers/users-controllers");

// @route   POST api/users
// @access  Public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "insert a valid email").normalizeEmail().isEmail(),
    check("password", "please insert 6 characters min for password").isLength({
      min: 6,
    }),
  ],
  registerUser
);

module.exports = router;
