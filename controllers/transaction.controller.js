const { Transaction, Product } = require("../models");

module.exports = {
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
