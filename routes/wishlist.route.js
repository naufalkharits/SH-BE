const router = require("express").Router();
const controller = require("../controllers/wishlist.controller");

router.post("/", controller.createWishlist);
router.delete("/", controller.deleteWishlist);

module.exports = router;
