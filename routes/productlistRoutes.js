const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");

router.get("/product-list", async (req, res) => {
  try {
    const search = req.query.search || "";
    const filter = req.query.filter || ""; // new filter param
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    let query = { name: { $regex: search, $options: "i" } };

    // If filter is "out-of-stock", adjust query
    if (filter === "out-of-stock") {
      query.quantity = { $lte: 0 };
    }

    const totalProducts = await StockModel.countDocuments(query);
    const products = await StockModel.find(query)
      .sort({ lastUpdate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("productlist", {
      title: "Product List",
      products,
      search,
      filter,
      page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
});

module.exports = router;
