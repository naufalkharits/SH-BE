const router = require("express").Router();
const controller = require("../controllers/chat.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/", checkAuth, controller.getChats);
router.get("/:id", checkAuth, controller.getChat);

module.exports = router;
