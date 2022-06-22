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
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.STRING,
      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserBiodata",
    }
  );
  return UserBiodata;
};
