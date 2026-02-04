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
      created_by,
    } = req.body;

    // basic guard (optional but good)
    if (!barcode || !name || !category || created_by == null) {
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
      created_by,
    });
    // ? if the project is successfully created, the new response will be returned as json
    res.status(200).json(newProduct);
    //res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    res.status(400).json(err);
  }
});

//DELETE /api/products/:id (owner only)
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: {
        id: req.params.id,
        created_by: req.session.user_id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ message: "No product found for this user." });
    }

    res.status(200).json({ message: "Product deleted." });
    //res.status(501).json({ message: "Not implemented yet" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;