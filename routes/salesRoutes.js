const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAgent } = require("../middleware/auth");
const SaleModel = require("../models/salesModel"); // now it will work ✅



router.get("/agent-dashboard", async (req, res) => {
  try {
    const sales = await SaleModel.find();
    // calculate total revenue
    const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);

    res.render("agent-dashboard", { totalAmount, sales });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



//  GET route - show sales page with list of sales
router.get("/Addsale", async (req, res) => {
  try {
    const sales = await SaleModel.find().sort({ date: -1 });
    res.render("sales", { sales }); // send sales to your PUG view
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).send("Error loading sales");
    res.redirect("/");
  }
});

// Handle new sale submission
// instead of agent name appearing in the , we are referencing the id of the user im database
router.post("/Addsale", ensureAuthenticated, ensureAgent, async (req, res) => {
  try {
    const {customerName, product, unitPrice, quantity, paymentType, transport, date} = req.body;
    const userId = req.session.user._id; // fixed
    const newSale = new SaleModel({
      customerName,
      product,
      unitPrice: Number(unitPrice), // convert to number
      quantity: Number(quantity), // convert to number
      paymentType,
      transport: transport === "on",
      agent: userId,
      date: date ? new Date(date) : Date.now(),
    });
    console.log(userId);
    await newSale.save();
    // console.log("Sale recorded:", newSale);
    // res.redirect("/Addsale");
    res.redirect("/salestable");
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(400).send("Error recording sale");
  }
});

// GET receipt page
// Show receipt after sale is created
router.get("/sales/:id/receipt", async (req, res) => {
  try {
    const sale = await SaleModel.findById(req.params.id);

    if (!sale) {
      return res.status(404).send("Sale not found");
    }

    // Calculate total
    let total = sale.quantity * 100000; // example: price placeholder
    if (sale.transport) {
      total += total * 0.05; // add 5% transport
    }

    res.render("receipt", { sale, total });
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).send("Error generating receipt");
  }
});

// router.get("/salestable", async (req, res) => {
  // sales agent sees sale records
  // try {
//     const sales = await SaleModel.find().populate("agent", "fullName");
//     const currentUser = req.session.user;
//     console.log(currentUser)
//     res.render("saleslist", { sales, currentUser});
//   } catch (error) {
//     console.error(error.message);
//     res.redirect("/");
//   }
// });
router.get("/salestable", async (req, res) => {
  try {
    const sales = await SaleModel.find().populate("agent", "fullName");
    const currentUser = req.session.user || null; // safe default
    res.render("saleslist", { sales, currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

router.get("/pos", (req, res) => {
  res.render("pos", { title: "POS Terminal" });
});



// Save a sale (from POS checkout)
router.post("/api/sales", async (req, res) => {
  try {
    const { items, subtotal, transport, total } = req.body;

    const newSale = new Sale({
      items,
      subtotal,
      transport,
      total,
    });

    await newSale.save();

    res.json({ success: true, message: "Sale recorded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving sale." });
  }
});

// Get all sales (for reports / dashboard)

router.get("/pos", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching sales." });
  }
});

module.exports = router;
