const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Product name must be provided
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
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
      default: Date.now, // if no date is entered, use current date
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("StockModel", stockSchema);
