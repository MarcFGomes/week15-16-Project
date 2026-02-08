const router = require("express").Router();
const { User, Salon, Product, Inventory } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  res.render("menu", {
    logged_in: req.session.logged_in,
    user_name: req.session.user_name,
  });
});

router.get("/inventory", withAuth, async (req, res) => {
  try {
    const inventoryData = await Inventory.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "barcode", "name", "category", "unit"],
        },
        { model: Salon, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] }, // updated_by
      ],
      order: [
        ["salon_id", "ASC"],
        ["product_id", "ASC"],
      ],
    });
    const inventory = inventoryData.map((p) => p.get({ plain: true }));

    /*res.render("home", {
      projects,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
      is_profile: false,
    }); */

    res.json(inventory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/inventory/:id", withAuth, async (req, res) => {
  try {
    const inventoryData = await Inventory.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "barcode", "name", "category", "unit"],
        },
        { model: Salon, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] }, // updated_by
      ],
    });

    if (!inventoryData)
      return res
        .status(404)
        .render("404", { logged_in: req.session.logged_in });

    const inventory = inventoryData.get({ plain: true });

    /*res.render("project", {
      project,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    }); */

    res.json(inventory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/products", withAuth, async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["id", "ASC"]],
    });
    const product = productData.map((p) => p.get({ plain: true }));

    res.render("product", {
      product,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    });

    //res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/products/:id", withAuth, async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!productData)
      return res
        .status(404)
        .render("404", { logged_in: req.session.logged_in });

    const product = productData.get({ plain: true });

    /*res.render("project", {
      project,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    }); */

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/salons", withAuth, async (req, res) => {
  try {
    const salonData = await Salon.findAll({
      order: [["id", "ASC"]],
    });
    const salons = salonData.map((p) => p.get({ plain: true }));

    res.render("salons", {
      salons,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//External API
router.get("/products/:id/details", withAuth, async (req, res) => {
  try {
    const { barcode } = req.query;

    if (!barcode) {
      return res.status(400).json({
        message: "barcode query parameter is required",
        example: "/api/products/barcodelookup?barcode=012345678901",
      });
    }

    const apiKey = process.env.API_KEY;
    const baseUrl = process.env.API_URL;

    if (!apiKey || !baseUrl) {
      return res.status(500).json({
        message: "Barcode API is not configured (missing env vars)",
      });
    }

    const url = `${baseUrl}?barcode=${encodeURIComponent(barcode)}&key=${encodeURIComponent(apiKey)}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ message: "Failed to fetch data from Barcode Lookup API" });
    }

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return res.status(404).json({ message: "No product found for this barcode" });
    }

    const barcodeInfo = data.products[0];
    //return res.json(barcodeInfo);
    return res.render("product-details", {
      barcodeInfo,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    });

  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
