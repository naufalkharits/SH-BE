const { Transaction, Product } = require("../models");

module.exports = {
  getTransactions: async (req, res) => {
    try {
      // Get User Transaction
      const transactions = await Transaction.findAll();

      res.status(200).json({
        transactions,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  getTransaction: async (req, res) => {
    // Validate transaction ID param
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Product ID is required",
      });
    }

    try {
      // Get transaction
      const transaction = await Transaction.findOne({
        where: {
          id: req.params.id,
        },
      });

      // Check if product not found
      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product not found",
        });
      }

      res.status(200).json({
        transaction,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  createTransaction: async (req, res) => {
    if (
      !Number.isInteger(+req.params.productId) ||
      !req.body ||
      !req.body.price ||
      !Number.isInteger(+req.body.price)
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid product ID and offered price is required",
      });
    }

    try {
      const product = await Product.findOne({
        where: { id: req.params.productId },
      });

      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const transaction = await Transaction.create({
        product_id: req.params.productId,
        buyer_id: req.user.id,
        price: req.body.price,
        status: "PENDING",
      });

      res.status(200).json({
        transaction,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
