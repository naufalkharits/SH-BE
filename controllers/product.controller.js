const {
  Product,
  Category,
  Picture,
  Notification,
  User,
  UserBiodata,
} = require("../models");
const {
  validatePicture,
  uploadProductImages,
  updateProductImages,
  deleteProductImages,
} = require("../utils/picture");
const { Op } = require("sequelize");

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.Category.name,
  description: product.description,
  seller: product.User.UserBiodatum,
  pictures: product.Pictures.sort((a, b) => a.id - b.id).map(
    (picture) => picture.url
  ),
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

module.exports = {
  mapProduct,
  getProducts: async (req, res) => {
    const { category, keyword, limit, offset } = req.query;

    try {
      // Get products
      const products = await Product.findAll({
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
          {
            model: User,
            include: [UserBiodata],
          },
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
        order: [["createdAt", "DESC"]],
      });

      const productsData = products.map((product) => mapProduct(product));

      res.status(200).json({ products: productsData });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  getProduct: async (req, res) => {
    // Validate product ID param
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Product ID is required",
      });
    }

    try {
      // Get product
      const product = await Product.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          Category,
          Picture,
          {
            model: User,
            include: [UserBiodata],
          },
        ],
      });

      // Check if product not found
      if (!product) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Get product pictures filename
      const productData = mapProduct(product);

      res.status(200).json({
        product: productData,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  createProduct: async (req, res) => {
    // Validate product required data
    if (!req.files) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message:
          "Product name, price, category, description, and picture is required",
      });
    }

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
      for (const picture of req.files) {
        validatePicture(picture);
      }
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

      // Check User Biodata Verification
      const biodata = await UserBiodata.findOne({
        where: { user_id: req.user.id },
      });

      if (
        !biodata ||
        !biodata.name ||
        !biodata.city ||
        !biodata.address ||
        !biodata.phone_number ||
        !biodata.picture
      ) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "User biodata must be filled in completely",
        });
      }

      // Check User Product Count
      const userProductsCount = await Product.count({
        where: {
          seller_id: req.user.id,
        },
      });

      if (userProductsCount >= 4) {
        return res.status(409).json({
          type: "MAX_PRODUCTS_COUNT",
          message: "Maximum products count is 4 per User",
        });
      }

      // Create new product
      const newProduct = await Product.create({
        name,
        price,
        category_id: productCategory.id,
        description,
        seller_id: req.user.id,
      });

      // Upload product pictures
      await uploadProductImages(req.files, newProduct.id);

      // Get new product data
      const product = await Product.findOne({
        where: {
          id: newProduct.id,
        },
        include: [
          Category,
          Picture,
          {
            model: User,
            include: [UserBiodata],
          },
        ],
      });

      const newProductData = mapProduct(product);

      // Create New Product Notification
      await Notification.create({
        type: "NEW_PRODUCT",
        user_id: req.user.id,
        product_id: product.id,
      });

      res.status(200).json({
        product: newProductData,
      });
    } catch (error) {
      console.log("Error : ", error);
      return res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  updateProduct: async (req, res) => {
    // Check if product id is valid
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Product ID is required",
      });
    }

    const { name, price, category, description } = req.body;

    try {
      // Find category id if category updated
      const productCategory = await Category.findOne({
        where: {
          name: category || null,
        },
      });

      if (category && !productCategory) {
        return res.status(400).json({
          type: "VALIDATION_FAILED",
          message: "Valid category name is required",
        });
      }

      // Update product
      await Product.update(
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
      );

      if (req.files) {
        try {
          for (const picture of req.files) {
            validatePicture(picture);
          }
        } catch (error) {
          return res.status(400).json({
            type: "VALIDATION_FAILED",
            message: error.message,
          });
        }

        // Update product pictures
        await updateProductImages(req.files, req.params.id);
      }

      // Get updated product data
      const product = await Product.findOne({
        where: { id: req.params.id },
        include: [Category, Picture],
      });

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
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  deleteProduct: async (req, res) => {
    // Check if product id is valid
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_ERROR",
        message: "Valid Product ID is required",
      });
    }

    try {
      // Delete product pictures
      await deleteProductImages(req.params.id);

      // Delete Product
      const result = Product.destroy({ where: { id: req.params.id } });
      // Check if product not found
      if (result === 0) {
        res
          .status(404)
          .json({ type: "NOT_FOUND", message: "Product not found" });
      } else {
        res.status(200).json({ message: "Product successfully deleted" });
      }
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
