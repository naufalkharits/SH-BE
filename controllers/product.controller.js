const { required } = require("nodemon/lib/config");
const { Product } = require("../models");
const { Category } = require("../models");
const { Op } = required("sequelize");

module.exports = {
  getProducts: (req, res) => {
    Product.findAll({
      where: {
        name: { [Op.like]: `%${req.query.name}` },
        description: { [Op.like]: `&${req.query.description}` },
      },
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
  getProduct: (req, res) => {
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
