const router = require("express").Router();
const controller = require("../controllers/transaction.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/transactions", controller.getTransactions);
router.get("/:id", controller.getTransaction);
router.post("/:productId", checkAuth, controller.createTransaction);

module.exports = router;
