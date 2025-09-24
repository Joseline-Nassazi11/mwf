const express = require("express");
const router = express.Router();
const passport = require ("passport");
const StockModel = require("../models/stockModel");

router.get("/dashboard", async (req, res) => {
  try {
    // total number of products
    const totalProducts = await StockModel.countDocuments();

    // total number of unique suppliers
    const totalSuppliers = await StockModel.distinct("supplier").then(
      (s) => s.length
    );

    // total quantity of items in stock
    const totalQuantityResult = await StockModel.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const totalQuantity = totalQuantityResult[0]?.total || 0;

    // Example: sales (later replace with SalesModel)
    const totalSales = 4500000;

    // render pug template
    res.render("dashboard", {
      totalProducts,
      totalSuppliers,
      totalQuantity,
      totalSales,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error.message);
    res.render("dashboard", {
      totalProducts: 0,
      totalSuppliers: 0,
      totalQuantity: 0,
      totalSales: 0,
    });
  }
});

router.get("/suppliers", (req, res) => {
  res.render("suppliers", { title: "Suppliers" });
})

router.get("/report", (req, res) => {
  res.render("reports", { title: "reports" });
});
module.exports = router;
