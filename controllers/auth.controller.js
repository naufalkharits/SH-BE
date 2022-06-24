const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Email and password is required",
        });
      }

      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.status(200).json({
          accessToken,
          refreshToken,
        });
      } else {
        res.status(400).json({
          type: "INVALID_CREDENTIALS",
          message: "Wrong email or password",
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ type: "SYSTEM_ERROR", message: "Something wrong with server" });
    }
  },
  register: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Email and password is required",
      });
    }
    
    try {
      const { email, password } = req.body;
      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (email.match(mailFormat)) {
        const checkEmail = await User.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (!checkEmail) {
          const encryptedPassword = await bcrypt.hash(password, 10);

          const newUser = await User.create({
            email,
            password: encryptedPassword,
          });
          const accessToken = generateAccessToken(newUser.id);
          const refreshToken = generateRefreshToken(newUser.id);

          res.status(200).json({ accessToken, refreshToken });
        } else {
          res
            .status(409)
            .json({ type: "EMAIL_EXISTS", message: "Email already used" });
        }
      } else {
        res
          .status(400)
          .json({ type: "VALIDATION_FAILED", message: "Invalid email input" });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ type: "SYSTEM_ERROR", message: "Something wrong with server" });
    }
  },
  me: async (req, res) => {
    res.status(200).json({
      user: req.user,
    });
  },
  refresh: async (req, res) => {
    if (!req.body.refreshToken) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Refresh token is required",
      });
    }

    const refreshToken = req.body.refreshToken;

    try {
      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (!user) throw new Error();

      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res.status(401).json({
        type: "UNAUTHORIZED",
        message: "Invalid or expired refresh token",
      });
    }
  },
};
