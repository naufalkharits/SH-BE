const { Wishlist, Product, User } = require("../models");

module.exports = {
  getWishlists: async (req, res) => {
    try {
      const wishlists = await Wishlist.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      res.status(200).json({
        wishlists,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  createWishlist: async (req, res) => {
    // check if product_id and user_id is provided
    if (!Number.isInteger(+req.params.productId)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid product ID is required",
      });
    }

    try {
      // check if product exists
      const product = await Product.findOne({
        where: {
          id: req.params.productId,
        },
      });

      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // check if product is already in wishlist
      const wishlist = await Wishlist.findOne({
        where: {
          product_id: req.params.productId,
          user_id: req.user.id,
        },
      });

      if (wishlist) {
        return res.status(409).json({
          type: "ALREADY_EXISTS",
          message: "Product is already in wishlist",
        });
      }

      // create new wishlist
      const newWishlist = await Wishlist.create({
        product_id: req.params.productId,
        user_id: req.user.id,
      });

      res.status(200).json({
        wishlist: newWishlist,
      });
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  deleteWishlist: async (req, res) => {
    if (
      !req.body.product_id ||
      !req.body.user_id ||
      !Number.isInteger(+req.body.product_id) ||
      !Number.isInteger(+req.body.user_id)
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Product id and user id is required and valid",
      });
    }

    try {
      // Delete Wishlist pictures
      //await deleteProductImages(req.params.id);

      // Delete Wishlist
      const result = await Wishlist.destroy({
        where: { product_id: req.body.product_id, user_id: req.body.user_id },
      });
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
