const router = require("express").Router();
const controller = require("../controllers/product.controller");
const multer = require("multer");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", multer().array("pictures", 4), controller.createProduct);
router.put("/:id", multer().array("pictures", 4), controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

router.post("/update-product/:id", controller.updateProduct);
router.delete("/delete-product/:id", controller.deleteProduct);
module.exports = router;
