const router = require("express").Router();
const controller = require("../controllers/transaction.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/transactions", controller.getTransactions);
router.get("/:id", controller.getTransaction);
router.post("/:productId", checkAuth, controller.createTransaction);
router.put("/:id", controller.updateTransaction);
router.delete("/:id", controller.deleteTransaction);
module.exports = router;
