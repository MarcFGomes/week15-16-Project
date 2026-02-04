const router = require("express").Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const inventoryRoutes = require("./inventoryRoutes");

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/inventory", inventoryRoutes);

module.exports = router;