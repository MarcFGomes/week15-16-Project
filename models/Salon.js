const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Salon extends Model {}

Salon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "salon",
    tableName: "salons",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Salon;