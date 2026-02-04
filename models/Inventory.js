const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Inventory extends Model {}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    salon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "salons", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "user", key: "id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "inventory",
    tableName: "inventory",
    underscored: true,
    timestamps: true,
    indexes: [
      // one row per salon + product
      { unique: true, fields: ["salon_id", "product_id"] },
    ],
  }
);

module.exports = Inventory;