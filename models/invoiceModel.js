// models/invoiceModel.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaleModel",
    required: true,
  },
  invoiceNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InvoiceModel", invoiceSchema);
