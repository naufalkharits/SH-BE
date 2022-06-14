const Product = require("../models").Product;
const Category = require("../models").Category;

module.exports = {
  getproduct_api: (req, res) => {
    Product.findAll()
      .then((result) => {
        if (result.length > 0) {
          res
            .status(200)
            .json({ message: "SUKSES Get All PRODUCT", data: result });
        } else {
          res
            .status(404)
            .json({ message: "PRODUCT Tidak DiTemukan!", data: result });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "GAGAL Get All PRODUCT",
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
          res.status(200).json({ message: "SUKSES Get PRODUCT By Id", result });
        } else {
          res.status(404).json({
            message:
              " PRODUCT dengan ID " + req.params.id + " Tidak DiTemukan!",
            result,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "GAGAL Get PRODUCT By Id",
          err: err.message,
        });
      });
  },
};
