const router = require("express").Router();
const controller = require("../controllers/transaction.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/", checkAuth, controller.getTransactions);
router.get("/:id", checkAuth, controller.getTransaction);
router.post("/:productId", checkAuth, controller.createTransaction);
router.put("/:id", checkAuth, controller.updateTransaction);
router.delete("/:id", checkAuth, controller.deleteTransaction);
module.exports = router;
