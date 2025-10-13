const mongoose = require("mongoose");

// const stockRecordSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   type: { type: String, required: true },
//   supplier: { type: String },
//   quantity: { type: Number, required: true },
//   cost: { type: Number, required: true },
//   price: { type: Number, required: true },
//   quality: { type: String },
//   // createdAt: { type: Date, default: Date.now },
//   lastUpdate: {
//     type: Date,
//     default: Date.now, // if no date is entered, use current date
//   }
// });
const stockRecordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    supplier: { type: String },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    quality: { type: String },
    lastUpdate: { type: Date, default: Date.now },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);


module.exports = mongoose.model("StockRecord", stockRecordSchema);
