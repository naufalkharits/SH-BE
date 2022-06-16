"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Picture.belongsTo(models.Product, {
        foreignKey: "product_id",
        onDelete: "CASCADE",
      });
    }
  }
  Picture.init(
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Picture",
      timestamps: false,
    }
  );
  return Picture;
};
