const express = require("express");
const router = express.Router();
const passport = require ("passport");
const StockModel = require("../models/stockModel");

const UserModel = require("../models/userModel");
//getting a signup route
router.get("/register", (req, res) => {
  res.render("signup", { title: "signup page" });
});

// router.post("/register", async (req, res) => {
//   try {
//     const { fullName, email, role, password, confirmPassword } = req.body;
//     // confirm passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).send("Passwords do not match");
//     }
//     // check for existing email
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("Already registered");
//     }
//     // create new user (only schema fields, no password here)
//     const newUser = new UserModel({ fullName, email, role });
//     // register with passport-local-mongoose
//     await UserModel.register(newUser, password);
//     res.redirect("/login");
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(400).send("Try again");
//   }
// });
// Public sign-up only for first Manager
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Only allow Manager to self-register
    if (role !== "Manager") {
      return res.status(403).send("Only Managers can self-register here.");
    }

    const newUser = new UserModel({ fullName, email, role });
    await UserModel.register(newUser, password);

    res.redirect("/login");
  } catch (err) {
    console.error("Error registering manager:", err);
    res.status(400).send("Failed to register manager: " + err.message);
  }
});
// Login route
router.get("/login", (req, res) => {
  res.render("login", { title: "login page" });
});

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
  req.session.user = req.user;
  if (req.user.role === "Manager") {
    res.redirect("/dashboard")
  } else if(req.user.role === "Attendants") {
    res.redirect("/Addsale")
  }else (res.render("noneuser"))
});

// logout route
router.get("/logout", (req,res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error logging out")
      }
      res.redirect("/")
    })
  }
});

module.exports = router;