const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated, ensureAgent } = require("../middleware/auth");
const SaleModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const InvoiceModel = require("../models/invoiceModel");

//  Add Sale 
router.get("/Addsale", ensureAuthenticated, ensureAgent, async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.render("sales", { stocks });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).send("Error loading sales");
  }
});

// Post Add sale
router.post("/Addsale", ensureAuthenticated, ensureAgent, async (req, res) => {
  try {
    const {
      customerName,
      productType,
      product,
      unitPrice,
      quantity,
      paymentType,
      transport,
      date,
    } = req.body;

    if (!customerName || !productType || !product || !unitPrice || !quantity) {
      return res.status(400).send("Missing required fields");
    }

    const userId = req.session.user?._id;
    if (!userId) return res.status(401).send("User not authenticated");

    const stock = await StockModel.findOne({
      type: productType,
      name: product,
    });
    if (!stock) return res.status(400).send("Product not found in stock");

    if (stock.quantity < Number(quantity)) {
      return res.status(400).send("Insufficient stock quantity");
    }

    let total = Number(unitPrice) * Number(quantity);
    if (transport === "on") total += total * 0.05;
    
    const newSale = new SaleModel({
      customerName,
      productType,
      product,
      unitPrice: Number(unitPrice),
      quantity: Number(quantity),
      totalPrice: total,
      paymentType,
      transport: transport === "on",
      agent: userId,
      date: date ? new Date(date) : Date.now(),
    });
    await newSale.save();

    stock.quantity -= Number(quantity);
    await stock.save();

    const invoiceCount = await InvoiceModel.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      invoiceCount + 1
    ).padStart(4, "0")}`;

    const invoice = new InvoiceModel({
      sale: newSale._id,
      invoiceNumber,
    });
    await invoice.save();

    res.redirect(`/invoices/${invoice._id}`);
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).send("Error recording sale");
  }
});

//  Edit Sale 
// GET edit form
router.get("/editsales/:id", async (req, res) => {
  try {
    const sale = await SaleModel.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");
    res.render("edit-sale", { sale });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST edit form
router.post("/editsales/:id", async (req, res) => {
  try {
    const {
      customerName,
      product,
      unitPrice,
      quantity,
      paymentType,
      transport,
    } = req.body;

    const totalPrice = Number(unitPrice) * Number(quantity);

    const updatedSale = await SaleModel.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        product,
        unitPrice,
        quantity,
        totalPrice,
        paymentType,
        transport: transport === "on" || transport === "true",
      },
      { new: true }
    );

    if (!updatedSale) return res.status(404).send("Sale not found");

    res.redirect("/salestable");
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete Sale
router.post("/deletesales/:id", async (req, res) => {
  try {
    await SaleModel.findByIdAndDelete(req.params.id);
    res.redirect("/salestable");
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).send("Internal Server Error");
  }
});

//  Sales List 
router.get("/salestable", async (req, res) => {
  try {
    const sales = await SaleModel.find().populate("agent", "fullName");
    const currentUser = req.session.user || null;
    res.render("saleslist", { sales, currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

//  Receipt 
router.get("/sales/:id/receipt", async (req, res) => {
  try {
    const sale = await SaleModel.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");

    let total = sale.totalPrice;
    res.render("receipt", { sale, total });
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).send("Error generating receipt");
  }
});

//  Invoice 
router.get("/invoices/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid invoice ID:", id);
    return res.status(400).send("Invalid invoice ID");
  }

  try {
    const invoice = await InvoiceModel.findById(id).populate("sale");
    if (!invoice) return res.status(404).send("Invoice not found");
    res.render("invoice", { invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).send("Error loading invoice");
  }
});


router.post("/api/sales", async (req, res) => {
  try {
    const { items, subtotal, transport, total } = req.body;
    const newSale = new SaleModel({ items, subtotal, transport, total });
    await newSale.save();
    res.json({ success: true, message: "Sale recorded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving sale." });
  }
});

router.get("/api/sales", async (req, res) => {
  try {
    const sales = await SaleModel.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sales." });
  }
});

module.exports = router;
