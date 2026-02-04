const router = require("express").Router();
const { User, Salon, Product, Inventory } = require("../models");
//const withAuth = require("../utils/auth"); To do later

router.get("/inventory", async (req, res) => {
  try {
    const inventoryData = await Inventory.findAll({
        include: [
        { model: Product, attributes: ["id", "barcode", "name", "category", "unit"] },
        { model: Salon, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] } // updated_by
        ],
      order: [["salon_id", "ASC"], ["product_id", "ASC"]],
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

router.get("/inventory/:id", async (req, res) => {
  try {
    const inventoryData = await Inventory.findByPk(req.params.id, {
        include: [
        { model: Product, attributes: ["id", "barcode", "name", "category", "unit"] },
        { model: Salon, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] } // updated_by
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

router.get("/products", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["id", "ASC"]],
    });
    const product = productData.map((p) => p.get({ plain: true }));

    /*res.render("home", {
      projects,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
      is_profile: false,
    }); */

    res.json(product);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/products/:id", async (req, res) => {
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

router.get("/salons", async (req, res) => {
  try {
    const salonData = await Salon.findAll({
      order: [["id", "ASC"]],
    });
    const salon = salonData.map((p) => p.get({ plain: true }));

    /*res.render("home", {
      projects,
      logged_in: req.session.logged_in,
      user_name: req.session.user_name,
      is_profile: false,
    }); */

    res.json(salon);

  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;