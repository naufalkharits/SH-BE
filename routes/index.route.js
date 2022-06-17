const router = require("express").Router();
const productRoutes = require("./product.route");

router.use("/product", productRoutes);

router.use("/update-product", productRoutes);
router.use("/delete-product", productRoutes);
module.exports = router;
