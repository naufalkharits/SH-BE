const router = require("express").Router();
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");

router.use("/product", productRoutes);
router.use("/auth", authRoutes);

module.exports = router;
