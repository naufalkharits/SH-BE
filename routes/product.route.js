const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);
module.exports = router;
