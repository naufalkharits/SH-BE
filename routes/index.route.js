const router = require("express").Router();
const productRoutes = require("./product.route");
const authRoutes = require("./auth.route");
const categoryRoutes = require("./category.route");
const biodataRoutes = require("./biodata.route");
const wishlistRoutes = require("./wishlist.route");

router.use("/product", productRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/biodata", biodataRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
