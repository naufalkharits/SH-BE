const router = require("express").Router();
const controller = require("../controllers/product.controller");
const multer = require("multer");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", multer().array("pictures", 4), controller.createProduct);

module.exports = router;
