const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

const StockModel = require("../models/stockModel");
const SaleModel = require("../models/salesModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");

// STOCK MANAGEMENT
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock-manage");
});

// Add or update stock
router.post("/stock", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const { name, type, quantity, cost, price, quality, lastUpdate, supplier } =
      req.body;
    let stock = await StockModel.findOne({ name, type });

    if (stock) {
      // update existing stock
      stock.quantity += Number(quantity);
      stock.cost = Number(cost);
      stock.price = Number(price);
      stock.quality = quality;
      stock.lastUpdate = lastUpdate || Date.now();
      stock.supplier = supplier || stock.supplier;
      await stock.save();
      console.log(
        `Stock updated: ${stock.name}, new quantity = ${stock.quantity}`
      );
    } else {
      // create new stock entry
      stock = new StockModel({
        name,
        type,
        supplier,
        quantity: Number(quantity),
        cost: Number(cost),
        price: Number(price),
        quality,
        lastUpdate: lastUpdate || Date.now(),
      });
      await stock.save();
      console.log(
        `New stock added: ${stock.name}, quantity = ${stock.quantity}`
      );
    }

    // Redirect to dashboard so cards show updated values
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).send("Error adding stock");
  }
});

// Add finished product form
router.get("/stock/add-finished", (req, res) => {
  res.render("finished-form");
});

// Add raw material form
router.get("/stock/add-raw", (req, res) => {
  res.render("raw-form");
});

// Handle raw material submission
router.post("/stock/add-raw", async (req, res) => {
  try {
    const raw = new RawMaterial(req.body);
    await raw.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving raw material:", err);
    res.status(400).send("Failed to save material");
  }
});

// DASHBOARD

// Now all routes go below, including /dashboard
router.get("/dashboard", async (req, res) => {
  // dashboard route code
});

// router.get("/debug-sales", async (req, res) => {
//   const sales = await SaleModel.find({}, "productType").lean();
//   console.log("All productTypes in Sales:", sales);
//   res.send(sales);
// });

//  STOCK TABLE

router.get("/stocklist", async (req, res) => {
  try {
    let items = await StockModel.find().sort({ $natural: -1 }).lean();
    res.render("stock-table", { items });
  } catch (error) {
    console.error("Error retrieving stock items:", error.message);
    res.status(400).send("Error retrieving stock items");
  }
});

// CRUD OPERATIONS

// Edit stock item (GET form)
router.get("/stock/edit/:id", async (req, res) => {
  const item = await StockModel.findById(req.params.id).lean();
  res.render("stock-edit", { item });
});

// Handle edit (POST)
router.post("/stock/edit/:id", async (req, res) => {
  await StockModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/stocklist");
});

// Adjust stock (GET form)
router.get("/stock/adjust/:id", async (req, res) => {
  const item = await StockModel.findById(req.params.id).lean();
  res.render("stock-adjust", { item });
});

// Handle adjust (POST)
router.post("/stock/adjust/:id", async (req, res) => {
  await StockModel.findByIdAndUpdate(req.params.id, {
    quantity: req.body.quantity,
  });
  res.redirect("/stocklist");
});

// Delete stock item
router.post("/stock/delete/:id", async (req, res) => {
  await StockModel.findByIdAndDelete(req.params.id);
  res.redirect("/stocklist");
});

router.get("/stock-records", async (req, res) => {
  try {
    const stockRecords = await StockModel.find().lean(); // ✅ good variable name
    res.render("stock-record", { stockRecords }); // ✅ matches pug template
  } catch (err) {
    console.error("Error fetching stock records:", err);
    res.status(500).send("Error fetching stock records");
  }
});

module.exports = router;
