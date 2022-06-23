const router = require("express").Router();
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");
const categoryRoutes = require("./category.route");
const userbiodataRoutes = require("./userbiodata.route");

router.use("/product", productRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/userbiodata", userbiodataRoutes);

module.exports = router;
