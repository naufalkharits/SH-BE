const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  return token;
};

module.exports = {
  generateAccessToken,
};
