const router = require("express").Router();
const productRoutes = require("./product.route");

router.use("/product", productRoutes);

module.exports = router;
