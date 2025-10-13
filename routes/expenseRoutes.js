const express = require("express");
const router = express.Router();
const ExpenseModel = require("../models/expenseModel");

// Add new expense
router.get("/", async (req, res) => {
  try {
    const expenses = await ExpenseModel.find().sort({ createdAt: -1 });

    // Total spending
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Summaries by category
    const summary = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.render("manager-dashboard", {
      title: "Manager Dashboard",
      expenses,
      total,
      summary,
    });
  } catch (err) {
    console.error("Error loading expenses:", err);
    res.status(500).send("Server Error: Could not load expenses.");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    await ExpenseModel.create({ description, amount, category });

    res.redirect("/dashboard"); // Redirect back to manager dashboard
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).send("Server Error: Could not add expense.");
  }
});

// Delete an expense by ID
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ExpenseModel.findByIdAndDelete(id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).send("Server Error: Could not delete expense.");
  }
});

module.exports = router;
