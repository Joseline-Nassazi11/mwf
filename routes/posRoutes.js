const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");
const SaleModel = require("../models/salesModel");
const UserModel = require("../models/userModel"); // make sure you import this
const OrderModel = require("../models/orderModel");

// GET /POS page
router.get("/pos", async (req, res) => {
  try {
    const stockRecords = await StockModel.find().lean();
    res.render("pos", { stockRecords });
  } catch (err) {
    console.error("Error fetching stock records:", err);
    res.status(500).send("Error loading POS");
  }
});

// POST /checkout
router.post("/checkout", async (req, res) => {
  try {
    const { items, transport, paymentType, customerName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in the cart" });
    }

    // Ensure logged-in user exists
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "Agent not found" });
    }
    const agentId = req.user._id;

    for (const item of items) {
      // Look up stock item by name
      const stockItem = await StockModel.findOne({ name: item.name });
      if (!stockItem) {
        return res
          .status(404)
          .json({ error: `Stock item not found: ${item.name}` });
      }

      const totalPrice = stockItem.price * item.qty;

      // Create Sale
      const sale = new SaleModel({
        agent: agentId,
        paymentType: paymentType || "Cash",
        quantity: item.qty,
        unitPrice: stockItem.price,
        totalPrice,
        product: stockItem._id, // store ObjectId
        productType: stockItem.type || "General",
        customerName: customerName || "Walk-in",
        transport: !!transport, // convert to Boolean
      });
      await sale.save();

      // Create Order
      const order = new OrderModel({
        customerName: customerName || "Walk-in",
        productId: stockItem._id,
        quantity: item.qty,
        totalPrice,
      });
      await order.save();

      // Reduce stock quantity
      await StockModel.findByIdAndUpdate(stockItem._id, {
        $inc: { quantity: -item.qty },
      });
    }

    res.json({ message: "Sale & order saved successfully!" });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Error completing checkout" });
  }
});
module.exports = router;
