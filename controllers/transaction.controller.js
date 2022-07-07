const { Transaction, Product } = require("../models");
const { Op, col } = require("sequelize");

module.exports = {
  getTransactions: async (req, res) => {
    try {
      // Get User Transaction
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [
            {
              buyer_id: req.query.as === "seller" ? -1 : req.user.id,
            },
            {
              "$Product.seller_id$":
                req.query.as === "buyer" ? -1 : req.user.id,
            },
          ],
          status: {
            [Op.like]: req.query.status ? req.query.status.toUpperCase() : "%",
          },
        },
        include: [Product],
      });

      res.status(200).json({
        transactions,
      });
    } catch (error) {
      console.log(error);
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
      if (!transaction) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Transaction not found",
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

  updateTransaction: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Transaction ID required",
      });
    }

    if (
      req.body.status &&
      req.body.status.toLowerCase() !== "pending" &&
      req.body.status.toLowerCase() !== "accepted" &&
      req.body.status.toLowerCase() !== "rejected"
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid status is required",
      });
    }

    const { price, status } = req.body;

    try {
      await Transaction.update(
        {
          price: price,
          status: status?.toUpperCase(),
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      const transaction = await Transaction.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Transaction not found",
        });
      }
      res.status(200).json({ updatedtransaction: transaction });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  deleteTransaction: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Transaction ID is required",
      });
    }

    try {
      const result = await Transaction.destroy({
        where: { id: req.params.id },
      });
      if (result === 0) {
        res
          .status(404)
          .json({ type: "NOT_FOUND", message: "Transaction not found" });
      } else {
        console.log(result);
        res.status(200).json({ message: "Transaction successfully deleted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
