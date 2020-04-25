const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const { validationResult } = require("express-validator");
const HttpError = require("../../util/error-model");

// 1- Get authenticated user
const getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      const error = new HttpError("User not found!", 404);
      return next(error);
    }
    res.json(user);
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Server error!", 500);
    return next(error);
  }
};

// 2- Authenticate user & get token
const getUserToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { email, password } = req.body;

  try {
    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      const error = new HttpError("Invalid credentials!", 400);
      return next(error);
    }

    //   check if the credentials match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new HttpError("Invalid credentials!", 400);
      return next(error);
    }

    // return jwt
    const payload = {
      userId: {
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

module.exports = { getAuthUser, getUserToken };
