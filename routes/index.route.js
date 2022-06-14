const router = require("express").Router();
const productRoutes = require("./product.route");

router.use("/products", productRoutes);

module.exports = router;
