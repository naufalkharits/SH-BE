const router = require("express").Router();
const controller = require("../controllers/notification.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/", checkAuth, controller.getNotifications);
router.put("/:id", checkAuth, controller.updateNotification);
router.delete("/:id", checkAuth, controller.deleteNotification);

module.exports = router;
