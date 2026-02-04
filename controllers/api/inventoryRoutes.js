const router = require("express").Router();
const { Inventory } = require("../../models");
const withAuth = require("../../utils/auth");

// POST /api/inventory
// Body: { salon_id, product_id, quantity }
router.post("/", withAuth, async (req, res) => {
  try {
    const { salon_id, product_id, quantity } = req.body;

    // Validate input
    if (salon_id == null || product_id == null || quantity == null) {
      return res.status(400).json({
        message: "salon_id, product_id, and quantity are required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        message: "quantity cannot be negative",
      });
    }

    const updated_by = req.session.user_id;

    // Find or create (enforces unique salon_id + product_id)
    const [row, created] = await Inventory.findOrCreate({
      where: { salon_id, product_id },
      defaults: {
        quantity,
        updated_by,
      },
    });

    // If it already existed, UPDATE it
    if (!created) {
      row.quantity = quantity;
      row.updated_by = updated_by;
      await row.save();
    }

    return res.status(created ? 201 : 200).json({
      message: created ? "Inventory row created" : "Inventory updated",
      inventory: row,
    });
  } catch (err) {
    // FK violation (invalid salon_id, product_id, or user)
    if (err?.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Invalid salon_id, product_id, or user reference",
      });
    }

    return res.status(500).json(err);
  }
});

module.exports = router;