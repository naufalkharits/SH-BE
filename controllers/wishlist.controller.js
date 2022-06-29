const { Wishlist } = require("../models");

module.exports = {
  createWishlist: (req, res) => {},
  deleteWishlist: (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_ERROR",
        message: "Valid Wishlist ID is required",
      });
    }

    try {
      // Delete Wishlist pictures
      //await deleteProductImages(req.params.id);

      // Delete Wishlist
      const result = Wishlist.destroy({ where: { id: req.params.id } });
      // Check if Wishlist not found
      if (result === 0) {
        res
          .status(404)
          .json({ type: "NOT_FOUND", message: "Wishlist not found" });
      } else {
        res.status(200).json({ message: "Wishlist successfully deleted" });
      }
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
