const express = require("express");
// const stockModel = require("../models/stockModel");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

const StockModel = require("../models/stockModel");
const FinishedProduct = require("../models/finishedModel");
const RawMaterial = require("../models/rawModel");
const SaleModel = require("../models/salesModel");

router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock-manage");
});

router.post("/stock", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const stock = new StockModel(req.body);
    console.log(req.body);
    await stock.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/stock"); //just incase we fail to save
  }
});

router.get("/stock/add-finished", (req, res) => {
  res.render("finished-form"); // pug file name (add-raw.pug)
});

// Show form page
router.get("/stock/add-raw", (req, res) => {
  res.render("raw-form"); // pug file name (add-raw.pug)
});

// Handle form submission
// Add raw material (save into StockModel so dashboard can see it)
router.post("/stock/add-raw", async (req, res) => {
  try {
    console.log("Form data received:", req.body); //  log what is being sent
    const raw = new RawMaterial(req.body);
    await raw.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving raw material:", err); //  log the full error
    res.status(400).send("Failed to save material");
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    // expenses for buying wood stock
    let totalExpenseTimber = await RawMaterial.aggregate([
      { $match: { productType: "Timber" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // cost price is unit price for each one item,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpensePoles = await StockModel.aggregate([
      { $match: { productType: "Poles" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // cost price is unit price for each one item,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpenseSoftwood = await StockModel.aggregate([
      { $match: { productType: "Softwood" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // cost price is unit price for each one item,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpenseHardwood = await StockModel.aggregate([
      { $match: { productType: "Hardwood" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // cost price is unit price for each one item,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    // sales revenue
let totalRevenueTimber = await SaleModel.aggregate([
  { $match: { product: "Timber" } },
  {
    $group: {
      _id: "$productType",
      totalQuantity: { $sum: "$quantity" },
      // unit price for each one item,
      totalCost: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
    },
  },
]);
    // to avoid crashing the app if no expenses have ben incured/ added yet
    // set default values if no expenses in the db
    // totalRevenueTimber = totalRevenueTimber[0]||{totalQuantity:0,totalCost:0};

    totalExpenseTimber = totalExpenseTimber[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpensePoles = totalExpensePoles[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpenseSoftwood = totalExpenseSoftwood[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpenseHardwood = totalExpenseHardwood[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    res.render("dashboard", {
      totalExpenseTimber,
      totalExpensePoles,
      totalExpenseSoftwood,
      totalExpenseHardwood,
      totalRevenueTimber: totalRevenueTimber[0],
    });
  } catch (error) {
    res.status(400).send("Unable to find items from the DB")
    console.error("Aggregation Error:", error.message);
  }
});

// router.get("/dashboard", async (req, res) => {
//   try {
//     const totalProducts = await StockModel.countDocuments();
//     const totalSuppliers = await StockModel.distinct("supplier").then(
//       (s) => s.length
//     );
//     const totalQuantity = await StockModel.aggregate([
//       { $group: { _id: null, total: { $sum: "$quantity" } } },
//     ]);
//     const totalSales = 4500000; // later: calculate from your SalesModel if you have one

//     res.render("dashboard", {
//       totalProducts,
//       totalSuppliers,
//       totalQuantity: totalQuantity[0]?.total || 0,
//       totalSales,
//     });
//   } catch (err) {
//     console.error(err);
//     res.render("dashboard", {
//       totalProducts: 0,
//       totalSuppliers: 0,
//       totalQuantity: 0,
//       totalSales: 0,
//     });
//   }
// });
// getting stock from the database and rendering it to the stock-table.pug file
router.get("/stocklist", async (req, res) => {
  try {
    let items = await StockModel.find().sort({ $natural: -1 }).lean();
    console.log(items);
    res.render("stock-table", { items }); // wrap inside an object
  } catch (error) {
    console.error("Error retrieving stock items:", error.message);
    res.status(400).send("Error retrieving stock items");
  }
});

// t sorting you want them grouped by type (like Furniture section, Wood section, etc.), you can use MongoDB aggregation:
// router.get("/stocklist", async (req, res) => {
//   try {
//     let grouped = await StockModel.aggregate([
//       { $sort: { type: 1 } }, // sort first
//       {
//         $group: {
//           _id: "$type",
//           products: { $push: "$$ROOT" },
//         },
//       },
//     ]);

//     res.render("stock-table", { grouped });
//   } catch (error) {
//     console.error("Error retrieving stock items:", error.message);
//     res.status(400).send("Error retrieving stock items");
//   }
// });

// Update stock item - show edit form
// Edit form (GET)
router.get("/stock/edit/:id", async (req, res) => {
  const item = await StockModel.findById(req.params.id).lean();
  res.render("stock-edit", { item });
});

// Handle edit (POST)
router.post("/stock/edit/:id", async (req, res) => {
  await StockModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/stocklist");
});

// Adjust form (GET) - e.g., for quantity
router.get("/stock/adjust/:id", async (req, res) => {
  const item = await StockModel.findById(req.params.id).lean();
  res.render("stock-adjust", { item });
});

// Handle adjust (POST)
router.post("/stock/adjust/:id", async (req, res) => {
  await StockModel.findByIdAndUpdate(req.params.id, {
    quantity: req.body.quantity,
  });
  res.redirect("/stocklist");
});

// Delete (POST)
router.post("/stock/delete/:id", async (req, res) => {
  await StockModel.findByIdAndDelete(req.params.id);
  res.redirect("/stocklist");
});

module.exports = router;
