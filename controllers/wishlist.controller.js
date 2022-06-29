const { Wishlist, Product, User } = require("../models");

module.exports = {
  createWishlist: async (req, res) => {
    // check if product_id and user_id is provided
    if (!req.body.product_id || !req.body.user_id || !Number.isInteger(+req.body.product_id) || !Number.isInteger(+req.body.user_id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Product id and user id is required and valid",
      });
    }

    const { product_id, user_id } = req.body;

    try {
      // check if product exists
      const product = await Product.findOne({
        where: {
          id: product_id,
        },
      });

      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product does not exist",
        });
      }

      // check if user exists
      const user = await User.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "User does not exist",
        });
      }

      // check if product is already in wishlist
      const wishlist = await Wishlist.findOne({
        where: {
          product_id,
          user_id,
        },
      });

      if (wishlist) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Product is already in wishlist",
        });
      }

      // create new wishlist
      const newWishlist = await Wishlist.create({
        product_id,
        user_id,
      });

      return res.status(200).json({
        type: "SUCCESS",
        message: "Product added to wishlist",
        data: newWishlist,
      });
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  deleteWishlist: async (req, res) => {
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
      const result = await Wishlist.destroy({ where: { id: req.params.id } });
      // Check if Wishlist not found
      if (result === 0) {
        res.status(404).json({ type: "NOT_FOUND", message: "Wishlist not found" });
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
