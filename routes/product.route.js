const router = require("express").Router();
const controller = require("../controllers/product.controller");
const multer = require("multer");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", multer().array("pictures", 4), controller.createProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
