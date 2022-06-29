"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, {
        foreignKey: "seller_id",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Transaction, {
        foreignKey: "buyer_id",
        onDelete: "CASCADE",
      });
      User.hasOne(models.UserBiodata, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      refresh_token: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
