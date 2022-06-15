const router = require("express").Router();

const {
  getproduct_api,
  getproductbyid_api,
} = require("../controllers/product.controller");

router.get("/api/get-product-api", getproduct_api);
router.get("/api/get-productbyid/:id", getproductbyid_api);

module.exports = router;
