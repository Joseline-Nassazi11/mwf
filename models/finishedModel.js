const mongoose = require("mongoose");

const finishedProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productType: {
    type: String,
    enum: ["Chair", "Table", "Sofa", "Cupboard", "Bed"],
    required: true,
  },
  supplier: { type: String },
  quantity: { type: Number, default: 0 },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  quality: {
    type: String,
    enum: ["Grade A", "Grade B", "Grade C"],
    default: "Grade A",
  },
  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FinishedProduct", finishedProductSchema);
