const router = require("express").Router();
const controller = require("../controllers/notification.controller");

router.get("/", controller.getNotifications);
router.put("/:id", controller.updateNotification);
router.delete("/:id", controller.deleteNotification);

module.exports = router;
