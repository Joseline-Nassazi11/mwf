const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StockModel",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "open" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderModel", orderSchema);
