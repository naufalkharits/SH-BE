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
      Transaction.hasMany(models.Notification, {
        foreignKey: "transaction_id",
        onDelete: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      buyer_id: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      expiry_date: { type: DataTypes.STRING, allowNull: true },
      invoice_id: { type: DataTypes.STRING, allowNull: true },
      invoice_url: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
