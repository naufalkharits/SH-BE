"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User, {
        as: "buyer",
        foreignKey: "buyer_id",
      });
      Chat.belongsTo(models.User, {
        as: "seller",
        foreignKey: "seller_id",
      });
      Chat.hasMany(models.ChatMessage, {
        foreignKey: "chat_id",
        onDelete: "CASCADE",
      });
    }
  }
  Chat.init(
    {
      buyer_id: { type: DataTypes.INTEGER, allowNull: false },
      seller_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
