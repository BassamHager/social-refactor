const { validationResult } = require("express-validator");

//  not working properly
const serverError = (res, err) => {
  console.log(err.message);
  return res.status(500).send("Server error!");
};

const validationError = async () => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

const badRequestReturn = (res, errMsg) => {
  return res.status(400).json({ errors: [{ msg: errMsg }] });
};

const notFoundError = (res, missing) => {
  return res.status(404).json({ msg: `this ${missing} is not found!` });
};

const notAuthorizedError = (res) => {
  return res.sendStatus(401).json({ msg: "User not authorized!" });
};

module.exports = {
  serverError,
  validationError,
  badRequestReturn,
  notFoundError,
  notAuthorizedError,
};
