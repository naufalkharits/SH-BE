"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
      });
      Product.hasMany(models.Picture, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Transaction, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Wishlist, {
        foreignKey: "product_id",
      });
      Product.belongsTo(models.User, {
        foreignKey: "seller_id",
      });
    }
  }
  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      category_id: { type: DataTypes.INTEGER, allowNull: false },
      description: DataTypes.TEXT,
      seller_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
