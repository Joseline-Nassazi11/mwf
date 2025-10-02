const express = require("express");
const router = express.Router();
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");

// Dashboard GET Route
// router.get("/dashboard", async (req, res) => {
//   try {
//     // --- 1. Dates
//     const today = new Date();
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(today.getDate() - 6); // last 7 days including today

//     // --- 2. Total Revenue (30 days)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(today.getDate() - 30);
//     const salesLast30 = await SaleModel.find({ date: { $gte: thirtyDaysAgo } });
//     const totalRevenue = salesLast30.reduce(
//       (sum, s) => sum + (s.totalPrice || 0),
//       0
//     );

//     // --- 3. Gross Profit (placeholder: 30% of revenue)
//     const grossProfit = totalRevenue * 0.3;

//     // --- 4. Capital in Stock
//     const stock = await StockModel.find();
//     const capitalInStock = stock.reduce(
//       (sum, item) => sum + item.quantity * item.cost,
//       0
//     );

//     // --- 5. Out of Stock
//     const productsOutOfStock = await StockModel.countDocuments({
//       quantity: { $lte: 0 },
//     });

//     // --- 6. Open Orders (no model yet, so 0)
//     const totalOpenOrders = 0;

//     // --- 7. Recent Sales (last 5)
//     const recentSales = await SaleModel.find().sort({ date: -1 }).limit(5);

//     // --- 8. Stock Summary
//     const stockSummary = await StockModel.find().limit(10).lean();

//     // --- 9. Sales Trend (aggregate per day, last 7 days)
//     const salesTrendRaw = await SaleModel.aggregate([
//       { $match: { date: { $gte: sevenDaysAgo } } },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$date" },
//             month: { $month: "$date" },
//             day: { $dayOfMonth: "$date" },
//           },
//           totalSales: { $sum: "$totalPrice" }, // total revenue
//           transactions: { $sum: 1 }, // count of sales
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
//     ]);

//     // Convert to labels & values for Chart.js
//     const labels = [];
//     const revenueData = [];
//     const transactionsData = [];

//     for (let i = 0; i < 7; i++) {
//       const d = new Date();
//       d.setDate(today.getDate() - (6 - i));

//       const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
//       labels.push(dayLabel);

//       const found = salesTrendRaw.find(
//         (s) =>
//           s._id.year === d.getFullYear() &&
//           s._id.month === d.getMonth() + 1 &&
//           s._id.day === d.getDate()
//       );

//       revenueData.push(found ? found.totalSales : 0);
//       transactionsData.push(found ? found.transactions : 0);
//     }

//     res.render("manager-dashboard", {
//       totalRevenue,
//       grossProfit,
//       capitalInStock,
//       productsOutOfStock,
//       totalOpenOrders,
//       recentSales,
//       stockSummary,
//       chartLabels: JSON.stringify(labels),
//       chartRevenue: JSON.stringify(revenueData),
//       chartTransactions: JSON.stringify(transactionsData),
//     });
//   } catch (err) {
//     console.error("Error loading manager dashboard:", err);
//     res.status(500).send("Server Error: Could not load dashboard.");
//   }
// });


router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // last 7 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // --- 1. Revenue (last 30 days)
    const salesLast30 = await SaleModel.find({ date: { $gte: thirtyDaysAgo } });
    const totalRevenue = salesLast30.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0
    );

    // --- 2. Gross Profit (placeholder: 30% of revenue)
    const grossProfit = totalRevenue * 0.3;

    // --- 3. Capital in Stock
    const stock = await StockModel.find();
    const capitalInStock = stock.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );

    // --- 4. Out of Stock
    const productsOutOfStock = await StockModel.countDocuments({
      quantity: { $lte: 0 },
    });

    // --- 5. Open Orders (placeholder since no model yet)
    const totalOpenOrders = 0;

    // --- 6. Recent Sales
    const recentSales = await SaleModel.find()
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // --- 7. Stock Summary
    const stockSummary = await StockModel.find().limit(10).lean();

    // --- 8. Attendants (users with role = "Attendants")
    const totalAttendants = await UserModel.countDocuments({
      role: "Attendants",
    });

    // --- 9. Suppliers
    const totalSuppliers = await SupplierModel.countDocuments();

    // --- 10. Losses (placeholder: 10% of gross profit)
    const totalLosses = grossProfit * 0.1;

    // --- 11. Sales Trend (last 7 days)
    const salesTrendRaw = await SaleModel.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalSales: { $sum: "$totalPrice" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format trend data for Chart.js
    const labels = [];
    const revenueData = [];
    const transactionsData = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));

      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      labels.push(label);

      const found = salesTrendRaw.find(
        (s) =>
          s._id.year === d.getFullYear() &&
          s._id.month === d.getMonth() + 1 &&
          s._id.day === d.getDate()
      );

      revenueData.push(found ? found.totalSales : 0);
      transactionsData.push(found ? found.transactions : 0);
    }

    // Render dashboard with all KPIs
    res.render("manager-dashboard", {
      totalRevenue,
      grossProfit,
      capitalInStock,
      productsOutOfStock,
      totalOpenOrders,
      recentSales,
      stockSummary,
      totalAttendants,
      totalSuppliers,
      totalLosses,
      chartLabels: JSON.stringify(labels),
      chartRevenue: JSON.stringify(revenueData),
      chartTransactions: JSON.stringify(transactionsData),
    });
  } catch (err) {
    console.error("Error loading manager dashboard:", err);
    res.status(500).send("Server Error: Could not load dashboard.");
  }
});


// Reports Page Route
router.get("/reports", async (req, res) => {
  try {
    // Fetch sales data
    const sales = await SaleModel.find({})
      .populate("agent") // populate agent details
      .sort({ date: -1 })
      .lean();

    // Fetch stock adjustment data
    const stockAdjustments = await StockModel.find({ quantity: { $lte: 10 } })
      .sort({ lastUpdate: -1 })
      .lean();

    res.render("reports", {
      title: "Reports",
      sales,
      stockAdjustments
    });
  } catch (err) {
    console.error("Error loading reports:", err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;