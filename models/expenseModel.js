const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Supplies", "Transport", "Maintenance", "Utilities", "Wages", "Others"],
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("ExpenseModel", expenseSchema);
