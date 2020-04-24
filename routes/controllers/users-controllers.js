const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const {
  serverError,
  validationError,
  badRequestReturn,
} = require("../../errors");

// 1- Register user
const registerUser = async (req, res) => {
  validationError(req);

  const { name, email, password } = req.body;

  try {
    // check if user exists
    let user = await User.findOne({ email });

    if (user) {
      badRequestReturn("User already exists!");
    }

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
    serverError(err);
  }
};

module.exports = { registerUser };
