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
    existingUser = await User.findOne({ email });
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

  let avatar, hashedPassword;
  try {
    avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  const payload = {
    userId: newUser.id,
  };

  try {
    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      return res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
        token,
      });
    });
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Server error!", 500);
    return next(error);
  }
};

// 2- Login a user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("User is not registered!, please sign up", 404);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ userId: existingUser.id, token });
};

// 3- Delete a user by id
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

module.exports = { registerUser, login, deleteUser };
