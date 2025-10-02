const express = require("express");
const router = express.Router();
const SupplierModel = require("../models/supplierModel");


// --- GET All Suppliers ---
router.get("/dashboard/suppliers", async (req, res) => {
  try {
    const suppliers = await SupplierModel.find().sort({ createdAt: -1 });
    res.render("suppliers", { title: "Suppliers", suppliers });
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).send("Server Error");
  }
});

// --- POST Add Supplier ---
router.post("/dashboard/suppliers/add", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const supplier = new SupplierModel({ name, phone, email, address });
    await supplier.save();
    res.redirect("/dashboard/suppliers");
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).send("Server Error");
  }
});

// --- POST Edit Supplier ---
router.post("/dashboard/suppliers/edit/:id", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    await SupplierModel.findByIdAndUpdate(req.params.id, {
      name,
      phone,
      email,
      address,
    });
    res.redirect("/dashboard/suppliers");
  } catch (err) {
    console.error("Error editing supplier:", err);
    res.status(500).send("Server Error");
  }
});

// --- POST Delete Supplier ---
router.post("/dashboard/suppliers/delete/:id", async (req, res) => {
  try {
    await SupplierModel.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/suppliers");
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
