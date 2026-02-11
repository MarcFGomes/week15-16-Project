const sequelize = require("../config/connection");
const { User, Salon, Product, Inventory } = require("../models");

const userData = require("./userData.json");
const salonData = require("./salonData.json");
const productData = require("./productData.json");
const inventoryData = require("./inventoryData.json");

console.log("DATABASE_URL?", !!process.env.DB_URL);
console.log("DB_PASSWORD type:", typeof process.env.DB_PASSWORD);

const seedDatabase = async () => {
  try {
    // DROP + CREATE tables in correct order
    await User.sync({ force: true });
    await Salon.sync({ force: true });
    await Product.sync({ force: true });
    await Inventory.sync({ force: true });

    // Seed Users (bcrypt hooks)
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // Seed Salons
    const salons = await Salon.bulkCreate(salonData, { returning: true });

    // Seed Products
    const products = await Product.bulkCreate(productData, { returning: true });

    // Seed Inventory
    await Inventory.bulkCreate(inventoryData);

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();
