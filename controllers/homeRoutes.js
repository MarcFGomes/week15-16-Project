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




router.get("/products/new", withAuth, (req, res) => {
  res.render("product-new", {
    logged_in: req.session.logged_in,
    user_name: req.session.user_name,
  });
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

    product.createdAt = new Date(product.createdAt).toLocaleDateString();

    res.render("product-info", {
      product,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
    });

    //res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//External API
router.get("/products/:id/details", withAuth, async (req, res) => {
  try {
    // 1) Get product from DB
    const productData = await Product.findByPk(req.params.id);
    if (!productData) {
      return res.status(404).render("404", { logged_in: req.session.logged_in });
    }
    const product = productData.get({ plain: true });

    // 2) Prepare barcode lookup
    const apiKeyRaw = process.env.API_KEY || "";
    const apiKey = apiKeyRaw.replace(/^key=/, ""); // in case your env has "key="
    const baseUrl = process.env.API_URL;

    let barcodeInfo = null;
    let barcodeMessage = null;

    if (!product.barcode) {
      barcodeMessage = "This product has no barcode saved.";
    } else if (!apiKey || !baseUrl) {
      barcodeMessage = "Barcode API is not configured.";
    } else {
      const u = new URL(baseUrl);
      u.searchParams.set("barcode", product.barcode);
      u.searchParams.set("key", apiKey);

      const response = await fetch(u.toString());

      if (!response.ok) {
        barcodeMessage = `Barcode information is temporarily unavailable (${response.status}).`;
      } else {
        const data = await response.json();
        barcodeInfo = data?.products?.[0] || null;
        if (!barcodeInfo) {
          barcodeMessage = "No barcode information found for this product.";
        }
      }
    }

    // 3) Render page (always)
    return res.render("product-details", {
      product,
      barcodeInfo,
      barcodeMessage,
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
