const router = require("express").Router();
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");
const categoryRoutes = require("./category.route");

router.use("/product", productRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
