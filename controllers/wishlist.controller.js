const {
  Wishlist,
  Product,
  Category,
  Picture,
  User,
  UserBiodata,
} = require("../models");
const { mapProduct } = require("./product.controller");

const mapWishlist = (wishlist) => ({
  product: mapProduct(wishlist.Product),
});

module.exports = {
  checkWishlist: async (req, res) => {
    if (!Number.isInteger(+req.params.productId)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid product ID is required",
      });
    }

    try {
      const product = await Product.findOne({
        where: { id: req.params.productId },
      });

      console.log("Product : ", product);

      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const wishlist = await Wishlist.findOne({
        where: {
          user_id: req.user.id,
          product_id: req.params.productId,
        },
      });

      res.status(200).json({
        isWishlist: wishlist ? true : false,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  getWishlists: async (req, res) => {
    try {
      const wishlists = await Wishlist.findAll({
        where: {
          user_id: req.user.id,
        },
        include: [
          {
            model: Product,
            include: [
              Category,
              Picture,
              {
                model: User,
                include: [UserBiodata],
              },
            ],
          },
        ],
      });

      const wishlistsData = wishlists.map((wishlist) => mapWishlist(wishlist));

      res.status(200).json({
        wishlists: wishlistsData,
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
      await Wishlist.create({
        product_id: req.params.productId,
        user_id: req.user.id,
      });

      const newWishlist = await Wishlist.findOne({
        where: {
          product_id: req.params.productId,
          user_id: req.user.id,
        },
        include: [
          {
            model: Product,
            include: [
              Category,
              Picture,
              {
                model: User,
                include: [UserBiodata],
              },
            ],
          },
        ],
      });

      const newWishlistData = mapWishlist(newWishlist);

      res.status(200).json({
        wishlist: newWishlistData,
      });
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  deleteWishlist: async (req, res) => {
    if (!Number.isInteger(+req.params.productId)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid product ID is required",
      });
    }

    try {
      // Delete Wishlist
      const result = await Wishlist.destroy({
        where: { product_id: req.params.productId, user_id: req.user.id },
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
