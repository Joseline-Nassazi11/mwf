const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");

router.get("/pos", async (req, res) => {
  try {
    const stockRecords = await StockModel.find().lean();
    res.render("pos", { stockRecords });
  } catch (err) {
    console.error("Error fetching stock records:", err);
    res.status(500).send("Error loading POS");
  }
});

module.exports = router;
