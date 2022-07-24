const router = require("express").Router();
const controller = require("../controllers/product.controller");
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");

const checkMulterError = (err, req, res, next) => {
  if (err && err.message === "Unexpected field") {
    return res.status(400).json({
      type: "MAX_PICTURES_COUNT",
      message: "Maximum product pictures count is 4",
    });
  }

  next();
};

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post(
  "/",
  checkAuth,
  multer().array("pictures", 4),
  checkMulterError,
  controller.createProduct
);
router.put(
  "/:id",
  checkAuth,
  multer().array("pictures", 4),
  checkMulterError,
  controller.updateProduct
);
router.delete("/:id", checkAuth, controller.deleteProduct);

module.exports = router;
