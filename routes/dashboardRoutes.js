const express = require("express");
const router = express.Router();
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");

// // Dashboard Page
// router.get("/dashboard", async (req, res) => {
//   try {
//     const purchaseCosts = await StockModel.aggregate([
//       { $group: { _id: null, total: { $sum: "$costPrice" } } },
//     ]);
//     const sales = await SaleModel.aggregate([
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);
//     const attendants = await UserModel.countDocuments();
//     const suppliers = await SupplierModel.countDocuments();
//     const losses = await SaleModel.aggregate([
//       { $match: { isLoss: true } },
//       { $group: { _id: null, total: { $sum: "$lossAmount" } } },
//     ]);
//     const profits = await SaleModel.aggregate([
//       { $group: { _id: null, total: { $sum: "$profitAmount" } } },
//     ]);
//     const salesHistory = await SaleModel.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
//           total: { $sum: "$totalPrice" },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.render("dashboard", {
//       purchaseCosts: purchaseCosts[0]?.total || 0,
//       sales: sales[0]?.total || 0,
//       attendants,
//       suppliers,
//       losses: losses[0]?.total || 0,
//       profits: profits[0]?.total || 0,
//       salesHistory,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// Agent Dashboard Route
router.get("/agent-dashboard", async (req, res) => {
  try {
    const agentName = "MWF"; // Replace with dynamic user data if available

    // Total Sales
    const totalSales = await SaleModel.countDocuments({});

    // Total Quantity
    const sales = await SaleModel.find({});
    const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantitySold || 0), 0);

    // Total Revenue
    const totalAmount = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

    // Chart Data (last 7 days)
    const today = new Date();
    const labels = [];
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);

      const dayString = `${day.getMonth() + 1}/${day.getDate()}`;
      labels.push(dayString);

      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return (
          saleDate.getFullYear() === day.getFullYear() &&
          saleDate.getMonth() === day.getMonth() &&
          saleDate.getDate() === day.getDate()
        );
      });

      const dayTotal = daySales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
      chartData.push(dayTotal);
    }

    res.render("agent-dashboard", {
      title: `${agentName} - Dashboard`,
      agentName,
      totalSales,
      totalQuantity,
      totalAmount,
      chartLabels: labels,
      chartData,
    });
  } catch (err) {
    console.error("Error loading agent dashboard:", err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
