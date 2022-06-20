const { auth } = require("../models");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  login: async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await user_game.findOne({
        where: {
          id: req.params.id,
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
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  },
};
