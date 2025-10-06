const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");
// Handle checkout (save sale record)
const SaleModel = require("../models/salesModel");

router.get("/pos", async (req, res) => {
  try {
    const stockRecords = await StockModel.find().lean();
    res.render("pos", { stockRecords });
  } catch (err) {
    console.error("Error fetching stock records:", err);
    res.status(500).send("Error loading POS");
  }
});

// Handle checkout (save sale record)
router.post("/api/pos/checkout", async (req, res) => {
  try {
    const { items, subtotal, transport, total } = req.body;

    // Save one Sale record per item
    for (const item of items) {
      const sale = new SaleModel({
        productId: item.id,
        quantitySold: item.qty,
        totalPrice: item.price * item.qty,
      });
      await sale.save();

      // Reduce stock
      await StockRecord.findByIdAndUpdate(item.id, {
        $inc: { quantity: -item.qty },
      });
    }

    res.json({ message: "Sale completed successfully" });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Error completing sale" });
  }
});

module.exports = router;
