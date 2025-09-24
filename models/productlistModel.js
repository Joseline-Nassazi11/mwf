const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true }, // can change to Number if you prefer
  description: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
