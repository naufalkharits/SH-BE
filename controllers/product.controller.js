const Product = require("../models").Product;
const Category = require("../models").Category;
const ImageUtil = require("../utils/picture");

module.exports = {
  getProducts: (req, res) => {
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

  createProduct: async (req, res) => {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.price ||
      !req.body.category ||
      !req.body.description
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Product name, price, category, and description is required",
      });
    }

    if (req.files) {
      try {
        ImageUtil.validatePictures(req.files);
      } catch (error) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: error.message,
        });
      }
    }

    const { name, price, category, description } = req.body;

    try {
      const productCategory = await Category.findOne({
        where: {
          name: category,
        },
      });

      if (!productCategory) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Valid category name is required",
        });
      }

      const newProduct = await Product.create({
        name,
        price,
        category_id: productCategory.id,
        description,
        seller_id: 1,
      });

      let pictures = [];

      if (req.files) {
        pictures = await ImageUtil.uploadImages(req.files, newProduct.id);
      }

      res.status(200).json({
        product: {
          ...newProduct.dataValues,
          pictures,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
