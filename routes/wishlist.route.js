const router = require("express").Router();
const controller = require("../controllers/wishlist.controller");
const checkAuth = require("../middlewares/check-auth");

router.get("/", checkAuth, controller.getWishlists);
router.post("/:productId", checkAuth, controller.createWishlist);
router.delete("/", controller.deleteWishlist);

module.exports = router;
