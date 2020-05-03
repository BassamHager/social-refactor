const Profile = require("../../models/Profile");
const User = require("../../models/User");
const HttpError = require("../../util/error-model");
const { validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// 1- Get my profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    console.log(user);
    if (!profile) {
      return new HttpError("profile not found!", 404);
    }

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 2- Create or update a user profile
const createOrUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
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
  profileFields.user = req.userId;
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
    let profile = await Profile.findOne({ user: req.userId });

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
    return new HttpError("Server error!", 500);
  }
};

// 3- Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 4- Get user profile
const getUserProfile = async (req, res) => {
  try {
    let userProfile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "avatar"]);

    res.json(userProfile);
  } catch (err) {
    if (err.kind == "ObjectId") {
      console.log("getUserProfile -> ObjectId");
      return new HttpError("Profile not found!", 404);
    }
    console.error(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 5- Delete profile, user, post
const deleteProfile = async (req, res) => {
  try {
    // delete user posts

    // delete profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // delete user
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "user deleted!" });
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 6- Add profile experience
// @requires More restrictions to prevent unnecessary duplications
const addExp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { company, title, from, to, current, location, description } = req.body;

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
      return new HttpError("Profile not found!", 404);
    }

    profile.experience.unshift(newExp);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 7- Add profile education
// @requires More restrictions to prevent unnecessary duplications
const addEdu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
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
      return new HttpError("Profile not found!", 404);
    }

    profile.education.unshift(newEdu);
    await profile.save();
    return res.json(profile.education);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 8- Delete profile education
const deleteEdu = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return new HttpError("Profile not found!", 404);
    }

    profile.education = profile.education.filter(
      (item) => item.id !== req.params.eduId
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

// 9- Get user repos from github by user name
const getGithubRepos = async (req, res) => {
  try {
    const options = {
      uri: `http://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&clientSecret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return new HttpError("No Github repos found!", 404);
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    return new HttpError("Server error!", 500);
  }
};

module.exports = {
  getMyProfile,
  createOrUpdateProfile,
  getAllProfiles,
  getUserProfile,
  deleteProfile,
  addExp,
  addEdu,
  deleteEdu,
  getGithubRepos,
};
