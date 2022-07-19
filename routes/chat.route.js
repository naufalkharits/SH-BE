const router = require("express").Router();
const controller = require("../controllers/chat.controller");
// const checkAuth = require("../middlewares/check-auth");

router.get("/", controller.getChats);
router.get("/:id", controller.getChat);

module.exports = router;
