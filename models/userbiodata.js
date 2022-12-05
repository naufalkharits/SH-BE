"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserBiodata.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  UserBiodata.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      province: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      city: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      address: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      picture: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    },
    {
      sequelize,
      modelName: "UserBiodata",
    }
  );
  return UserBiodata;
};
