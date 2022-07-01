"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
      Wishlist.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Wishlist.init(
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Wishlist",
    }
  );
  return Wishlist;
};
