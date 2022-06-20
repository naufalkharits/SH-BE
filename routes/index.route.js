const router = require("express").Router();
const productRoutes = require("./product.route");
const authController = require("../controllers/auth");

router.use("/product", productRoutes);

router.post("/login", authController.login);
module.exports = router;
