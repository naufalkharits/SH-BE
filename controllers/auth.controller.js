const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/jwt");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All input is required" });
      }

      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = generateAccessToken(user.id);

        res.status(200).json({
          accessToken,
        });
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } catch (err) {
      res.status(500).json({ message: "system error" });
    }
  },
  register: async (req, res) => {
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

          res.status(200).json({ message: "User Created!", accessToken });
        } else {
          res.status(409).json({ message: "Email already exists" });
        }
      } else {
        res.status(400).json({ message: "Invalid email" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create new user" });
    }
  },
  me: async (req, res) => {
    res.status(200).json({
      user: req.user,
    });
  },
};
