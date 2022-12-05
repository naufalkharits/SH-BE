const { User, UserBiodata } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const { googleOAuthClient } = require("../utils/google-oauth");

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

      if (!user) {
        return res.status(404).json({
          type: "EMAIL_NOT_FOUND",
          message: "User / E-Mail not found",
        });
      }

      const isEqualPw = await bcrypt.compare(password, user.password);

      if (!isEqualPw) {
        return res.status(403).json({
          type: "WRONG_PASSWORD",
          message: "Wrong password",
        });
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      res
        .status(500)
        .json({ type: "SYSTEM_ERROR", message: "Something wrong with server" });
    }
  },
  register: async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Email, password and name is required",
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

          await UserBiodata.create({
            user_id: newUser.id,
            name: req.body.name,
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
      res
        .status(500)
        .json({ type: "SYSTEM_ERROR", message: "Something wrong with server" });
    }
  },
  me: async (req, res) => {
    const userData = await UserBiodata.findOne({
      where: {
        user_id: req.user.id,
      },
      include: [User],
    });

    res.status(200).json({
      user: {
        id: userData.user_id,
        name: userData.name,
        province: userData.province,
        city: userData.city,
        address: userData.address,
        phone_number: userData.phone_number,
        picture: userData.picture,
        email: userData.User.email,
      },
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
  googleAuth: async (req, res) => {
    if (!req.body.code) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Google auth code is required",
      });
    }

    try {
      const { tokens } = await googleOAuthClient.getToken(req.body.code);

      const userData = jwt.decode(tokens.id_token);

      let user = await User.findOne({ where: { email: userData.email } });

      if (!user) {
        const encryptedPassword = await bcrypt.hash(userData.sub, 10);

        user = await User.create({
          email: userData.email,
          password: encryptedPassword,
        });

        await UserBiodata.create({
          user_id: user.id,
          name: userData.name,
        });
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      res
        .status(500)
        .json({ type: "SYSTEM_ERROR", message: "Something wrong with server" });
    }
  },
};
