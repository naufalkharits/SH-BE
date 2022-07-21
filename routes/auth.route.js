const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);
router.get("/me", checkAuth, authController.me);
router.post("/refresh", authController.refresh);
router.put("/fcm", checkAuth, authController.updateFcmToken);

module.exports = router;
