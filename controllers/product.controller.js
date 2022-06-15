const Product = require("../models").Product;
const Category = require("../models").Category;
const Picture = require("../models").Picture;
const fs = require("fs/promises");
const path = require("path");

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

    let acceptedMimetypes = ["image/png", "image/jpg", "image/jpeg"];

    if (req.files) {
      for (const picture of req.files) {
        if (acceptedMimetypes.indexOf(picture.mimetype) < 0) {
          return res.status(400).json({
            type: "VALIDATION_FAILED",
            message: "Valid picture format is required",
          });
        }

        if (picture.size > 5 * 1000 * 1000) {
          return res.status(400).json({
            type: "VALIDATION_FAILED",
            message: "Picture size cannot be larger than 5 MB",
          });
        }
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

      const pictures = [];

      if (req.files) {
        for (let idx = 0; idx < req.files.length; idx++) {
          const newPicture = await Picture.create({
            product_id: newProduct.id,
          });

          const imageExt = req.files[idx].mimetype.replace("image/", "");
          const imageName = `${newPicture.id}.${imageExt}`;

          const imagePath = path.join(
            __dirname,
            "..",
            "public",
            "images",
            imageName
          );

          await fs.writeFile(imagePath, req.files[idx].buffer);
          pictures.push(imageName);
        }
      }

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
};
