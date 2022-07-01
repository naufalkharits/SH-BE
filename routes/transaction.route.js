const router = require("express").Router();
const controller = require("../controllers/transaction.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/:productId", checkAuth, controller.createTransaction);

module.exports = router;
