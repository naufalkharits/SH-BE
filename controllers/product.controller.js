const { Product } = require("../models");
const { Category } = require("../models");

module.exports = {
  getProducts: (req, res) => {
    Product.findAll()
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ message: "SUKSES Get All PRODUCT", data: result });
        } else {
          res.status(404).json({ message: "PRODUCT Tidak DiTemukan!", data: result });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "GAGAL Get All PRODUCT",
          err: err.message,
        });
      });
  },
  getProduct: (req, res) => {
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
            message: " PRODUCT dengan ID " + req.params.id + " Tidak DiTemukan!",
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
  updateProduct: (req, res) => {
    const { name, price, category, description } = req.body;
    console.log(req.body);
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({ message: "ID Must Be Integer" });
    }
    Category.findOne({
      where: {
        name: category,
      },
    }).then((result) => {
      if (!result) {
        return res.status(400).json({ message: "Category Not Found" });
      }
      Product.update(
        {
          name: name,
          price: price,
          category_id: result.id,
          description: description,
        },
        {
          where: {
            id: +req.params.id,
          },
          returning: true,
        }
      )
        .then((result) => {
          if (result[0] === 0) {
            res.status(400).json({ message: "Data Not Found!" });
          } else {
            res.status(200).json({ message: "Product Updated", data: result[1] });
          }
        })
        .catch((err) => {
          res.status(400).json({ message: "Error Updating User", err: err.message });
        });
    });
  },

  deleteProduct: (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({ message: "ID Must Be Integer" });
    }
    Product.destroy({ where: { id: req.params.id } })
      .then((result) => {
        console.log(result);
        if (result === 0) {
          res.status(400).json({ message: "Data Not Found!" });
        } else {
          res.status(200).json({ message: "Product Deleted" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Error Deleting Product", err: err.message });
      });
  },
};
