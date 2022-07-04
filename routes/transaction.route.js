const router = require("express").Router();
const controller = require("../controllers/transaction.controller");
const checkAuth = require("../middlewares/check-auth");

router.post("/:productId", checkAuth, controller.createTransaction);
router.put("/:id", checkAuth, controller.updateTransaction);
router.delete("/:id", controller.deleteTransaction);
module.exports = router;
