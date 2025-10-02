const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Living Room",
      "Dining Room",
      "Bedroom",
      "Office Furniture",
      "Wood Products",
      "Custom Orders",
      "Outdoor",
    ],
    required: true,
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});


module.exports = mongoose.model("ProductModel", productSchema);
