const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      trim: true,
    },
    type: {
      type: String,
      ref: "SupplierModel",
      trim: true,
      // enum: ['timber', 'poles', 'hardwood', 'softwood']
    },
    supplier: {
      type: String,
      trim: false,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    quality: {
      type: String,
      trim: true,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("StockModel", stockSchema);
