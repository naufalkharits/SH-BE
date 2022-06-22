const passport = require("passport");

const checkAuth = (req, res, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) {
      return res.status(401).json({
        type: "UNAUTHORIZED",
        message: "Unauthorized Access",
      });
    }
    req.user = {
      id: user.id,
      email: user.email,
    };
    next();
  })(req, res, next);
};

module.exports = checkAuth;
