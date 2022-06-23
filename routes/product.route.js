const router = require("express").Router();
const controller = require("../controllers/product.controller");
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post(
  "/",
  checkAuth,
  multer().array("pictures", 4),
  controller.createProduct
);
router.put(
  "/:id",
  checkAuth,
  multer().array("pictures", 4),
  controller.updateProduct
);
router.delete("/:id", checkAuth, controller.deleteProduct);

module.exports = router;
