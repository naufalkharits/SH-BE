"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
      });
      Notification.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }
  Notification.init(
    {
      type: { type: DataTypes.STRING, allowNull: false },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
