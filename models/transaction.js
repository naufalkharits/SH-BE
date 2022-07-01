"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: "buyer_id",
      });
      Transaction.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Transaction.init(
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      buyer_id: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
