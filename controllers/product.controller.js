const { Product, Category, Picture } = require("../models");
const {
  validatePictures,
  uploadProductImages,
  updateProductImages,
  deleteProductImages,
} = require("../utils/picture");
const { Op } = require("sequelize");

module.exports = {
  getProducts: (req, res) => {
    const { category, keyword, limit, offset } = req.query;

    // Get products
    Product.findAll({
      include: [
        // Filter by category
        {
          model: Category,
          where: {
            name: {
              [Op.iLike]: category || "%",
            },
          },
        },
        Picture,
      ],
      where: {
        [Op.or]: {
          name: {
            [Op.iLike]: keyword ? `%${keyword}%` : "%",
          },
          description: {
            [Op.iLike]: keyword ? `%${keyword}%` : "%",
          },
        },
      },
      limit: limit || undefined,
      offset: offset || undefined,
    })
      .then((products) => {
        // Get product category and pictures
        const productsData = products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.Category.name,
          description: product.description,
          seller_id: product.seller_id,
          pictures: product.Pictures.map((picture) => picture.url),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));
        res.status(200).json({ products: productsData });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          type: "SYSTEM_ERROR",
          message: "Something wrong with server",
        });
      });
  },

  getProduct: (req, res) => {
    // Validate product ID param
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Product ID is required",
      });
    }

    // Get product
    Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [Category, Picture],
    })
      .then((product) => {
        // Check if product not found
        if (!product) {
          return res.status(404).json({
            type: "NOT_FOUND",
            message: "Product not found",
          });
        }

        // Get product pictures filename
        const productData = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.Category.name,
          description: product.description,
          seller_id: product.seller_id,
          pictures: product.Pictures.map((picture) => picture.url),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };

        res.status(200).json({
          product: productData,
        });
      })
      .catch((error) => {
        res.status(500).json({
          type: "SYSTEM_ERROR",
          message: "Something wrong with server",
        });
      });
  },

  createProduct: async (req, res) => {
    // Validate product required data
    if (
      !req.body ||
      !req.body.name ||
      !req.body.price ||
      !req.body.category ||
      !req.body.description ||
      req.files.length < 1
    ) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message:
          "Product name, price, category, description, and picture is required",
      });
    }

    // Validate product pictures
    try {
      validatePictures(req.files);
    } catch (error) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: error.message,
      });
    }

    const { name, price, category, description } = req.body;

    try {
      // Get product category name
      const productCategory = await Category.findOne({
        where: {
          name: category,
        },
      });

      // Check if category exists
      if (!productCategory) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Valid category name is required",
        });
      }

      // Create new product
      const newProduct = await Product.create({
        name,
        price,
        category_id: productCategory.id,
        description,
        seller_id: 1,
      });

      // Upload product pictures
      await uploadProductImages(req.files, newProduct.id);

      // Get new product data
      const product = await Product.findOne({
        where: {
          id: newProduct.id,
        },
        include: [Category, Picture],
      });

      const newProductData = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.Category.name,
        description: product.description,
        seller_id: product.seller_id,
        pictures: product.Pictures.map((picture) => picture.url),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };

      res.status(200).json({
        product: newProductData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  updateProduct: (req, res) => {
    // Check if product id is valid
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Product ID is required",
      });
    }

    const { name, price, category, description } = req.body;

    // Find category id if category updated
    Category.findOne({
      where: {
        name: category || null,
      },
    }).then((productCategory) => {
      if (category && !productCategory) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Valid category name is required",
        });
      }

      // Update product
      Product.update(
        {
          name: name,
          price: price,
          category_id: category ? productCategory.id : undefined,
          description: description,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then((result) => {
          // Update product pictures
          updateProductImages(req.files, req.params.id).then(() => {
            // Get updated product data
            Product.findOne({
              where: { id: req.params.id },
              include: [Category, Picture],
            }).then((product) => {
              if (!product) {
                return res.status(404).json({
                  type: "NOT_FOUND",
                  message: "Product not found",
                });
              }
              // Format product response data
              const updatedProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.Category.name,
                description: product.description,
                seller_id: product.seller_id,
                pictures: product.Pictures.map((picture) => picture.url),
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              };

              res.status(200).json({ updatedProduct });
            });
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            type: "SYSTEM_ERROR",
            message: "Something wrong with server",
          });
        });
    });
  },

  deleteProduct: (req, res) => {
    // Check if product id is valid
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_ERROR",
        message: "Valid Product ID is required",
      });
    }

    // Delete product pictures
    deleteProductImages(req.params.id)
      .then(() => {
        // Delete Product
        Product.destroy({ where: { id: req.params.id } }).then((result) => {
          // Check if product not found
          if (result === 0) {
            res
              .status(404)
              .json({ type: "NOT_FOUND", message: "Product not found" });
          } else {
            res.status(200).json({ message: "Product successfully deleted" });
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          type: "SYSTEM_ERROR",
          message: "Something wrong with server",
        });
      });
  },
};
