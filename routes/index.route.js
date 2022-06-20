const router = require("express").Router();
const productRoutes = require("./product.route");
const { auth } = require("../controllers/auth");

router.use("/product", productRoutes);

router.post("/login", login);

router.use("/update-product", productRoutes);
router.use("/delete-product", productRoutes);

module.exports = router;
