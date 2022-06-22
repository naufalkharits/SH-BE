const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", checkAuth, authController.me);

module.exports = router;
