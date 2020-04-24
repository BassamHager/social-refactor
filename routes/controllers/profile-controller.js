const Profile = require("../../models/Profile");
const User = require("../../models/User");
const request = require("request");
const config = require("config");
const { serverError, validationError, notFoundError } = require("../../errors");

// 1- Get my profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      notFoundError(res, "profile");
    }

    res.json(profile);
  } catch (err) {
    serverError(res, err);
  }
};

// 2- Create or update a user profile
const createOrUpdateProfile = async (req, res) => {
  validationError();

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
    serverError(res, err);
  }
};

// 3- Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    serverError(res, err);
  }
};

// 4- Get user profile
const getUserProfile = async (req, res) => {
  try {
    let userProfile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "avatar"]);

    if (!userProfile) notFoundError(res, "profile");
    res.json(userProfile);
  } catch (err) {
    if (err.kind == "ObjectId") notFoundError(res, "profile");
    serverError(res, err);
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
    serverError(res, err);
  }
};

// 6- Add profile experience
// @requires More restrictions to prevent unnecessary duplications
const addExp = async (req, res) => {
  validationError(req, res);

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
    if (!profile) notFoundError(res, "profile");

    profile.experience.unshift(newExp);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    serverError(err);
  }
};

// 7- Add profile education
// @requires More restrictions to prevent unnecessary duplications
const addEdu = async (req, res) => {
  validationError(req, res);

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
    if (!profile) notFoundError(res, "profile");

    profile.education.unshift(newEdu);
    await profile.save();
    return res.json(profile.education);
  } catch (err) {
    serverError(err);
  }
};

// 8- Delete profile education
const deleteEdu = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) notFoundError(res, "profile");
    profile.education = profile.education.filter(
      (item) => item.id !== req.params.eduId
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    serverError(err);
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

      if (response.statusCode !== 200) notFoundError(res, "Github profile");

      res.json(JSON.parse(body));
    });
  } catch (err) {
    serverError(err);
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
