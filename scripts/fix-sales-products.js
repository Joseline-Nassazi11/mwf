// fix-sales-products.js
const mongoose = require("mongoose");
require("dotenv").config(); // make sure you have DB_URI in .env

const SaleModel = require("./models/salesModel");
const StockModel = require("./models/stockModel");

async function fixSales() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const sales = await SaleModel.find();
    console.log(`Found ${sales.length} sales`);

    for (const sale of sales) {
      // Try to find the stock by name and type
      const stock = await StockModel.findOne({
        name: sale.productType.toLowerCase(),
      });

      if (stock) {
        sale.product = stock._id;
        await sale.save();
        console.log(`Fixed sale ${sale._id} -> product set to ${stock._id}`);
      } else {
        console.log(
          `No matching stock for sale ${sale._id} (${sale.productType})`
        );
      }
    }

    console.log("Done fixing sales");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixSales();
