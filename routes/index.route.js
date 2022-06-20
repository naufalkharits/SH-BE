const router = require("express").Router();
const productRoutes = require("./product.route");
const { auth } = require("../controllers/auth");

router.use("/product", productRoutes);

router.post("/login", auth);

router.use("/update-product", auth, productRoutes);
router.use("/delete-product", auth, productRoutes);

module.exports = router;
