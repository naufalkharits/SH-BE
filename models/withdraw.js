"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Withdraw extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdraw.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
      })
    }
  }
  Withdraw.init(
    {
      transaction_id: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      no_rek: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Withdraw",
    }
  )
  return Withdraw
}
