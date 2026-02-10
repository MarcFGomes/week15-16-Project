const router = require("express").Router();
const { Product } = require("../../models");
const withAuth = require("../../utils/auth");

//POST /api/products (logged in only)
router.post("/", withAuth, async (req, res) => {

  try {
    const {
      barcode,
      name,
      category,
      unit,
      reorder_level,
      target_level,
    } = req.body;

    // basic guard
    if (
      !barcode ||
      !name ||
      !category ||
      !unit ||
      reorder_level === undefined ||
      target_level === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    
    console.log("logged_in:", req.session.logged_in);

    const newProduct = await Product.create({
      barcode,
      name,
      category,
      unit: unit || "unit",
      reorder_level: reorder_level ?? 1,
      target_level: target_level ?? 3,
       created_by: req.session.user_id, 
    });
    
    res.status(200).json(newProduct);
    //res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    res.status(400).json(err);
  }
});

//DELETE /api/products/:id 
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted." });
  } catch (err) {
    const code = err?.original?.code || err?.parent?.code;

    // FK constraint violation (product is referenced by inventory)
    if (code === "23503" || code === "23001") {
      return res.status(409).json({
        message:
          "You can’t delete this product because it’s used in Inventory. Remove it from Inventory first.",
      });
    }

    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;