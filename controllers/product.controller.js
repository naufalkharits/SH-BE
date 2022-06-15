const { Product } = require("../models").Product;
const { Category } = require("../models").Category;

module.exports = {
  getproduct_api: (req, res) => {
    Product.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "category_id",
        "description",
        "seller_id",
      ],
    })
      .then((result) => {
        if (result.length > 0) {
          res
            .status(200)
            .json({ message: "Valid Get All PRODUCT", data: result });
        } else {
          res.status(404).json({ message: "PRODUCT Not Found!", data: result });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed Get All PRODUCT",
          err: err.message,
        });
      });
  },
  getproductbyid_api: (req, res) => {
    Product.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "name",
        "price",
        "category_id",
        "description",
        "seller_id",
      ],
    })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Valid Get PRODUCT By Id", result });
        } else {
          res.status(404).json({
            message: " PRODUCT with ID " + req.params.id + " Not Found!",
            result,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Failed Get PRODUCT By Id",
          err: err.message,
        });
      });
  },
};
