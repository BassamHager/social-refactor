const jwt = require("jsonwebtoken");
const jwtSecret = require("config").get("jwtSecret");
const HttpError = require("../util/error-model");

module.exports = async (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");

  // check if valid token
  if (!token) {
    const error = new HttpError("No token, authorization denied!", 401);
    return next(error);
  }

  // verify token
  try {
    const decoded = await jwt.verify(token, jwtSecret);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    const error = new HttpError("Token is not valid!", 401);
    return next(error);
  }
};
