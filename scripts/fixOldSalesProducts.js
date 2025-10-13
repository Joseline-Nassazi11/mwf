// scripts/fixOldSalesProducts.js
const mongoose = require("mongoose");
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
require("dotenv").config();

async function main() {
  try {
    // Connect to your database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all sales
    const sales = await SaleModel.find();

    for (const sale of sales) {
      // Skip if the product is already an ObjectId
      if (mongoose.Types.ObjectId.isValid(sale.product)) continue;

      // Find matching stock by name
      const stock = await StockModel.findOne({ name: sale.product });
      if (stock) {
        sale.product = stock._id;
        await sale.save();
        console.log(`Fixed sale ${sale._id} → ${stock.name}`);
      } else {
        console.log(`⚠️ No stock found for "${sale.product}"`);
      }
    }

    console.log("All sales have been checked!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing sales:", error);
    process.exit(1);
  }
}

main();
