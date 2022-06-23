const jwt = require("jsonwebtoken");
const User = require("../models").User;
require("dotenv").config();

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  return token;
};

const generateRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
