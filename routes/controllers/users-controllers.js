const User = require("../../models/User");
const HttpError = require("../../util/error-model");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const { validationResult } = require("express-validator");

// 1- Register user
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already!, please login instead.",
      422
    );
    return next(error);
  }

  try {
    // get user gravatar
    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    user = new User({
      name,
      email,
      password,
      avatar,
    });

    // hash the password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // return jwt
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Server error!", 500);
    return next(error);
  }
};

// 2- delete a user by id
const deleteUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError("User not found!", 404);
      return next(error);
    }

    await user.remove();

    res.send({ msg: `user ${userId} 's been deleted!` });
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Server error!", 500);
    return next(error);
  }
};

module.exports = { registerUser, deleteUser };
