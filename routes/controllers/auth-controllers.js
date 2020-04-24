const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const {
  serverError,
  validationError,
  badRequestReturn,
} = require("../../errors");

// 1- Get authenticated user
const getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    serverError(err);
  }
};

// 2- Authenticate user & get token
const getUserToken = async (req, res) => {
  validationError(req, res);

  const { email, password } = req.body;

  try {
    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      badRequestReturn("Invalid credentials!");
    }

    //   check if the credentials match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      badRequestReturn(res, "Invalid credentials!");
    }

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
    serverError(err);
  }
};

module.exports = { getAuthUser, getUserToken };
