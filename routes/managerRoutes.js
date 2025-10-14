const express = require("express");
const router = express.Router();
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const SupplierModel = require("../models/supplierModel");
const UserModel = require("../models/userModel");
const OrderModel = require("../models/orderModel");
const ExpenseModel = require("../models/expenseModel"); 
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

router.get("/dashboard", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // last 7 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    //Revenue (last 30 days)
    const salesLast30 = await SaleModel.find({ date: { $gte: thirtyDaysAgo } });
    const totalRevenue = salesLast30.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0
    );

    // Gross Profit (placeholder: 30% of revenue)
    const grossProfit = totalRevenue * 0.3;

    //  Capital in Stock
    const stock = await StockModel.find();
    const capitalInStock = stock.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );

    //Out of Stock
    const productsOutOfStock = await StockModel.find({
      quantity: { $lte: 0 },
    }).lean();
    //Open Orders (placeholder since no model yet)
    const totalOpenOrders = await OrderModel.countDocuments({ status: "open" });

    //Recent Sales
    const recentSales = await SaleModel.find()
      .populate("product", "name") // linked product info
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // --- 7. Stock Summary
    const stockSummary = await StockModel.find().limit(10).lean();

    // Attendants (users with role = "Attendants")
    const totalAttendants = await UserModel.countDocuments({
      role: "Attendants",
    });

    // Suppliers
    const totalSuppliers = await SupplierModel.countDocuments();

    //  Losses (placeholder: 10% of gross profit)
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
// Expense tracker
    const expenses = await ExpenseModel.find().sort({ createdAt: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

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
      productsOutOfStock, //  pass to pug
      chartLabels: JSON.stringify(labels),
      chartRevenue: JSON.stringify(revenueData),
      chartTransactions: JSON.stringify(transactionsData),
      expenses,
      total, // total expenses
    });
  } catch (err) {
    console.error("Error loading manager dashboard:", err);
    res.status(500).send("Server Error: Could not load dashboard.");
  }
});


// Reports Page Route
router.get("/reports", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    // Fetch sales data
    const sales = await SaleModel.find({})
      .populate("agent") // populate agent details
      .populate("product", "name") //  populate product name from StockModel
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

// GET /OPEN-ORDERs
router.get("/open-orders", async (req, res) => {
  try {
    // Fetch all orders with status "open" and populate product info
    const openOrders = await OrderModel.find({ status: "open" })
      .populate("productId", "name type price") // get product details
      .sort({ date: -1 })
      .lean();

    res.render("open-orders", { openOrders });
  } catch (err) {
    console.error("Error loading open orders:", err);
    res.status(500).send("Server error");
  }
});


// GET form to add order
router.get("/AddOrder", async (req, res) => {
  try {
    const stockItems = await StockModel.find({ quantity: { $gt: 0 } }).lean();
    res.render("add-order", { stockItems });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
});

// router.post("/AddOrder", async (req, res) => {
//   try {
//     const { customerName, productId, quantity } = req.body;
//     const qty = Number(quantity);

//     if (!customerName || !productId || !qty)
//       return res.status(400).send("All fields are required");

//     const stockItem = await StockModel.findById(productId);
//     if (!stockItem) return res.status(400).send("Product not found");
//     if (stockItem.quantity < qty)
//       return res.status(400).send("Insufficient stock");

//     const totalPrice = stockItem.price * qty;

//     const order = new OrderModel({
//       customerName,
//       productId,
//       quantity: qty,
//       totalPrice,
//       status: "open",
//     });

//     await order.save();

//     // Update stock after saving order
//     stockItem.quantity -= qty;
//     await stockItem.save();

//     res.redirect("/open-orders");
//   } catch (err) {
//     console.error("Error adding order:", err);
//     res.status(500).send("Error adding order");
//   }
// });

// Mark order as completed
// 🟩 POST: Add Order
router.post("/AddOrder", async (req, res) => {
  try {
    const { customerName, productId, quantity } = req.body;
    const product = await StockModel.findById(productId);

    if (!product || product.quantity < quantity) {
      return res.status(400).send("Not enough stock available!");
    }

    const totalPrice = product.price * quantity;

    const newOrder = new OrderModel({
      customerName,
      productId,
      quantity,
      totalPrice,
    });

    await newOrder.save();

    // Reduce stock
    product.quantity -= quantity;
    await product.save();

    res.redirect("/open-orders");
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).send("Error adding order");
  }
});

router.post("/orders/:id/complete", async (req, res) => {
  try {
    const orderId = req.params.id;
    await OrderModel.findByIdAndUpdate(orderId, { status: "completed" });
    res.redirect("/open-orders");
  } catch (err) {
    console.error("Error completing order:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;