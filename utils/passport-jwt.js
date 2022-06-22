const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../models").User;
require("dotenv").config();

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ where: { id: payload.id } });
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);
