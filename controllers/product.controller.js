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

  createProduct: async (req, res) => {
    if (
      !req.body ||
      !req.body.name ||
      !req.body.price ||
      !req.body.category ||
      !req.body.description ||
      !req.files
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message:
          "Product name, price, category, description, and picture is required",
      });
    }

    try {
      ImageUtil.validatePictures(req.files);
    } catch (error) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: error.message,
      });
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

      console.log("New Product : ", newProduct);

      const pictures = await ImageUtil.uploadImages(req.files, newProduct.id);

      res.status(200).json({
        product: {
          ...newProduct.dataValues,
          pictures,
        },
      });
    } catch (error) {
      return res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
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
            res
              .status(200)
              .json({ message: "Product Updated", data: result[1] });
          }
        })
        .catch((err) => {
          res
            .status(400)
            .json({ message: "Error Updating User", err: err.message });
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
        res
          .status(500)
          .json({ message: "Error Deleting Product", err: err.message });
      });
  },
};
