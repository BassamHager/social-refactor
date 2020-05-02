const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const {
  getMyProfile,
  createOrUpdateProfile,
  getAllProfiles,
  getUserProfile,
  deleteProfile,
  addExp,
  addEdu,
  deleteEdu,
  getGithubRepos,
} = require("../controllers/profile-controller");

// @route   GET api/profile/me
// @access  Private
router.get("/me", auth, getMyProfile);

// @route   POST api/profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("status", "Status is required!").not().isEmpty(),
    check("skills", "Skills is required!").not().isEmpty(),
  ],
  createOrUpdateProfile
);

// @route   POST api/profile
// @access  Public
router.get("/", getAllProfiles);

// @route   POST api/profile/user/:userId
// @access  Private
router.get("/:userId", getUserProfile);

// @route   DELETE api/profile, user, post
// @access  Private
router.delete("/", auth, deleteProfile);

// @route   PUT api/profile/experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required!").not().isEmpty(),
    check("company", "Company is required!").not().isEmpty(),
    check("from", "From data is required!").not().isEmpty(),
  ],
  addExp
);

// @route   PUT api/profile/education
// @access  Private
router.put(
  "/education",
  [
    auth,
    check("school", "School is required!").not().isEmpty(),
    check("degree", "Degree is required!").not().isEmpty(),
    check("fieldofstudy", "Field of study is required!").not().isEmpty(),
    check("from", "From data is required!").not().isEmpty(),
  ],
  addEdu
);

// @route   DELETE api/profile/education/:eduId
// @access  Private
router.delete("/education/:eduId", auth, deleteEdu);

// @route   GET api/profile/github/:userName
// @access  Public
router.get("/github/:username", getGithubRepos);

module.exports = router;
