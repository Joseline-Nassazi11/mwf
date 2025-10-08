const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

const StockModel = require("../models/stockModel");
const StockRecordModel = require("../models/stockRecordModel");
const SaleModel = require("../models/salesModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");

// STOCK MANAGEMENT
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock-manage");
});

router.post("/stock", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const { name, type, quantity, cost, price, quality, lastUpdate, supplier } =
      req.body;

    const productName = name.trim().toLowerCase();
    let stock = await StockModel.findOne({ name: productName, type, supplier });

    let recordType = "New Stock";

    if (stock) {
      // update existing stock
      stock.quantity += Number(quantity);
      stock.cost = Number(cost);
      stock.price = Number(price);
      stock.quality = quality;
      stock.lastUpdate = lastUpdate || Date.now();
      stock.supplier = supplier || stock.supplier;
      await stock.save();

      recordType = "Restock";
      console.log(
        `Stock updated: ${stock.name}, new quantity = ${stock.quantity}`
      );
    } else {
      // create new stock entry
      stock = new StockModel({
        name: productName,
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

    // Always log to stock record (for both new and existing)
    const stockRecord = new StockRecordModel({
      name: productName,
      type,
      supplier,
      quantity: Number(quantity),
      cost: Number(cost),
      price: Number(price),
      quality,
      lastUpdate: Date.now(),
      action: recordType, // optional field
    });
    await stockRecord.save();

    res.redirect("/stock-records");
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).send("Error adding stock");
  }
});

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

// stock records
router.get("/stock-records", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const stockRecords = await StockRecordModel.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedRecords = stockRecords.map((item) => ({
      ...item,
      costFormatted: item.cost?.toLocaleString() || "0",
      priceFormatted: item.price?.toLocaleString() || "0",
      createdAtFormatted: item.createdAt
        ? new Date(item.createdAt).toISOString().split("T")[0]
        : "N/A",
    }));

    res.render("stock-record", { stockRecords: formattedRecords });
  } catch (err) {
    console.error("Error fetching stock records:", err);
    res.status(500).send("Error fetching stock records");
  }
});

module.exports = router;
