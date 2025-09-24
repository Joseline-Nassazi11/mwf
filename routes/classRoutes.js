const express = require("express");
const router = express.Router();

// Syntax of routing
// app.METHOD(PATH, HANDLER);

// Simple request time logger
// router.use((req, res, next) => {
//   console.log("A new request received at " + Date.now());

  // This function call tells that more processing is
  // required for the current request and is in the next middlewarefunction/route handler.
//   next();
// });
// Landing page
router.get("/", (req, res) => {
  res.render("index", { title: "Mayondo Wood & Furniture Ltd." });
});

router.get("/about", (req, res) => {
  res.send("About page. Nice.");
});

router.get("/Joseline", (req, res) => {
  res.send("This is Joseline's page.");
});

router.post("/about", (req, res) => {
  res.send("Got a POST request.");
});

router.put("/user", (req, res) => {
  res.send("Got a PUT request at/user.");
});

router.delete("/user", (req, res) => {
  res.send("Got a DELETE request at/user.");
});
// path paramenters and query strings
router.get("/pathParams/:username", (req, res) => {
  res.send("");
});

//serving html files
// router.get("/", (req, res) => {
//   res.sendFile(__dirname + "/html/index.html");
// });

// router.get("/register", (req, res) => {
//   res.sendFile(__dirname + "/html/signup.html");
// });
// post route
// router.post("/register", (req, res) => {
//   console.log(req.body);
// });

//home route
// router.get("/", (req, res) => {
//   res.send("Home page");
// });


module.exports = router