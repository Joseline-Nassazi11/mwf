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

    // const stock = await StockModel.findById(product);
    //   type: productType,
    //   name: product,
    // });
    // if (!stock) return res.status(400).send("Product not found in stock");
    // Find stock by its name instead of by ID
    const stock = await StockModel.findOne({ name: product }); // <-- change here
    if (!stock) return res.status(400).send("Product not found in stock");

    if (stock.quantity < Number(quantity)) {
      return res.status(400).send("Insufficient stock quantity");
    }

    let total = Number(unitPrice) * Number(quantity);
    if (transport === "on") total += total * 0.05;

    const newSale = new SaleModel({
      customerName,
      productType,
      product: stock._id,
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

res.redirect(`/invoices/sale/${newSale._id}`);
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).send("Error recording sale");
  }
});

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
    const sales = await SaleModel.find()
      .populate("agent", "fullName")
      .populate("product", "name type price");
    const currentUser = req.session.user || null;
    res.render("saleslist", { sales, currentUser, moment: require("moment") });
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
// // GET invoice by Sale ID
router.get("/invoices/sale/:saleId", ensureAuthenticated, async (req, res) => {
  const { saleId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(saleId)) {
    console.error("Invalid sale ID:", saleId);
    return res.status(400).send("Invalid sale ID");
  }

  try {
    // First, check if the sale exists
    const sale = await SaleModel.findById(saleId).populate("product", "name type price");
    if (!sale) {
      console.error("Sale not found:", saleId);
      return res.status(404).send("Sale not found");
    }

    // Find the invoice linked to this sale
    let invoice = await InvoiceModel.findOne({ sale: saleId }).populate({
      path: "sale",
      populate: { path: "product", select: "name type price" },
    });

    // If invoice does not exist, create one automatically
    if (!invoice) {
      const invoiceCount = await InvoiceModel.countDocuments();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, "0")}`;

      invoice = new InvoiceModel({
        sale: sale._id,
        invoiceNumber,
      });
      await invoice.save();
      console.log("Invoice auto-created:", invoice._id, "for sale:", sale._id);
    }

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
