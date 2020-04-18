const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ msg: "No profile for this user!" });
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500).json({ msg: "Server error!" });
  }
});

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("status", "Status is required!").not().isEmpty(),
    check("skills", "Skills is required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // build profile social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      console.log(profile);
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profileFields);

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500).send("Server error!");
    }
  }
);

// @route   POST api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500).send("Server error!");
  }
});

// @route   POST api/profile/user/:userId
// @desc    Get user profile
// @access  Private
router.get("/user/:userId", async (req, res) => {
  try {
    let userProfile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "avatar"]);

    if (!userProfile) return res.sendStatus(404).send("Profile not found!");
    res.json(userProfile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.sendStatus(404).send("Profile not found!");
    }
    return res.sendStatus(500).send("Server error!");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user, post
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // delete user posts
    // delete profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // delete user
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "user deleted!" });
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500).send("Server error!");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
// @requires More restrictions to prevent unnecessary duplications
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required!").not().isEmpty(),
    check("company", "Company is required!").not().isEmpty(),
    check("from", "From data is required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
    }

    const {
      company,
      title,
      from,
      to,
      current,
      location,
      description,
    } = req.body;

    // try shortcut
    const newExp = {
      company,
      title,
      from,
      to,
      current,
      location,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.sendStatus(404).json({ msg: "Profile not found" });
      }

      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.sendStatus(500).send("Server error!");
    }
  }
);

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
// @requires More restrictions to prevent unnecessary duplications
router.put(
  "/education",
  [
    auth,
    check("school", "School is required!").not().isEmpty(),
    check("degree", "Degree is required!").not().isEmpty(),
    check("fieldofstudy", "Field of study is required!").not().isEmpty(),
    check("from", "From data is required!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    // try shortcut
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.sendStatus(404).json({ msg: "Profile not found" });
      }

      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile.education);
    } catch (err) {
      console.log(err.message);
      return res.sendStatus(500).send("Server error!");
    }
  }
);

// @route   DELETE api/profile/education/:eduId
// @desc    Delete profile education
// @access  Private
router.delete("/education/:eduId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.sendStatus(404).json({ msg: "Profile not found!" });
    }
    profile.education = profile.education.filter(
      (item) => item.id !== req.params.eduId
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    return res.sendStatus(500).send("Server error!");
  }
});

module.exports = router;
