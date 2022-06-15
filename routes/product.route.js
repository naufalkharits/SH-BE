const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);

module.exports = router;
