const express = require("express");
const router = express.Router();
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");

// Agent Dashboard Route
// router.get("/agent-dashboard", async (req, res) => {
//   try {
//     const agentName = "MWF"; // Replace with dynamic user data if available

//     // Total Sales
//     const totalSales = await SaleModel.countDocuments({});

//     // Total Quantity
//     const sales = await SaleModel.find({});
//     const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantitySold || 0), 0);

//     // Total Revenue
//     const totalAmount = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);

//     // Chart Data (last 7 days)
//     const today = new Date();
//     const labels = [];
//     const chartData = [];

//     for (let i = 6; i >= 0; i--) {
//       const day = new Date();
//       day.setDate(today.getDate() - i);

//       const dayString = `${day.getMonth() + 1}/${day.getDate()}`;
//       labels.push(dayString);

//       const daySales = sales.filter(sale => {
//         const saleDate = new Date(sale.date);
//         return (
//           saleDate.getFullYear() === day.getFullYear() &&
//           saleDate.getMonth() === day.getMonth() &&
//           saleDate.getDate() === day.getDate()
//         );
//       });

//       const dayTotal = daySales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
//       chartData.push(dayTotal);
//     }

//     res.render("agent-dashboard", {
//       title: `${agentName} - Dashboard`,
//       agentName,
//       totalSales,
//       totalQuantity,
//       totalAmount,
//       chartLabels: labels,
//       chartData,
//     });
//   } catch (err) {
//     console.error("Error loading agent dashboard:", err);
//     res.status(500).send("Server Error");
//   }
// });
// Agent Dashboard Route
router.get("/agent-dashboard", async (req, res) => {
  try {
    const agentName = "MWF"; // Replace later with dynamic user if needed

    // ✅ Fetch all sales
    const sales = await SaleModel.find({});

    // ✅ Compute totals
    const totalSales = sales.length;
    const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
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

      const daySales = sales.filter((sale) => {
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

    // Render dashboard
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
