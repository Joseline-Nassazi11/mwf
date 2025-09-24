const express = require("express");
const router = express.Router();

// Route to render the product list page
router.get("/products", (req, res) => {
  res.render("productlist"); // productlist.pug inside views/
});

module.exports = router;
