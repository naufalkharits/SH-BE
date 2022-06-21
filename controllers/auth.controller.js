const { User } = require("../models");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  login: async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!email || !password) {
        return res.status(400).json({ message: "All input is required" });
      }

      // Validate if user exist in our database
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        /* // Create token
        const token = jwt.sign(
          { id_user: user.id_user, username, role_id: user.role_id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "15m",
          }
        );

        // save user token
        user.token = token;*/

        // user
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "Invalid Credentials" });
      }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      const encryptedPassword = await bcrypt.hash(password, 10);

      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (email.match(mailFormat)) {
        const checkEmail = await User.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (!checkEmail) {
          const newUser = await User.create({
            email,
            password: encryptedPassword,
          });
          res.status(200).json({ message: "User Created!", result: newUser });
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
};
