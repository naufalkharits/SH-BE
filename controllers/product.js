const Product = require("../models").Product;
const Category = require("../models").Category;

module.exports = {
  getproduct_api: (req, res) => {
    Product.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "category=id",
        "desription",
        "seller_id",
      ],
    })
      .then((result) => {
        if (result.length > 0) {
          res
            .status(200)
            .json({ message: "Sukses GET ALL PRODUCT", data: result });
        } else {
          res
            .status(404)
            .json({ message: "Maaf PRODUCT tidak Di Temukan", data: result });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Gagal GET ALL PRODUCT",
          err: err.message,
        });
      });
  },
  getproductbyid_api: (req, res) => {
    Product.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res
            .status(200)
            .json({ message: " SUKSES Get PRODUCT By Id", result });
        } else {
          res.status(404).json({
            message: "PRODUCT dengan ID " + req.params.id + " Tidak di temukan",
            result,
          });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "GAGAL Get PRODUCT By Id", err: err.message });
      });
  },
};
