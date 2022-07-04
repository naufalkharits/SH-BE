const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "3m",
  });

  const expiredAt = new Date(new Date().getTime() + 3 * 60000);

  return {
    token,
    expiredAt,
  };
};

const generateRefreshToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  const expiredAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60000);

  return { token, expiredAt };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
