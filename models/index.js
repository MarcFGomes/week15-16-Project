const User = require("./User");
const Salon = require("./Salon");
const Product = require("./Product");
const Inventory = require("./Inventory");

// Users → Products
User.hasMany(Product, { foreignKey: "created_by" });
Product.belongsTo(User, { foreignKey: "created_by" });

// Salons → Inventory
Salon.hasMany(Inventory, { foreignKey: "salon_id" });
Inventory.belongsTo(Salon, { foreignKey: "salon_id" });

// Products → Inventory
Product.hasMany(Inventory, { foreignKey: "product_id" });
Inventory.belongsTo(Product, { foreignKey: "product_id" });

// Users → Inventory updates
User.hasMany(Inventory, { foreignKey: "updated_by" });
Inventory.belongsTo(User, { foreignKey: "updated_by" });

module.exports = { User, Salon, Product, Inventory };