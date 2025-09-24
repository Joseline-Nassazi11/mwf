const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  unitPrice: {
  type: Number,
  required: true
},
  quantity: { type: Number, required: true, min: 1 },
  paymentType: {
    type: String,
    enum: ["Cash", "Cheque", "Bank Overdraft"],
    required: true,
  },
  transport: { type: Boolean, default: false },
  agent: { type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SaleModel", saleSchema);
