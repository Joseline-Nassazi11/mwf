const express = require("express");
const router = express.Router();
const passport = require ("passport");
const StockModel = require("../models/stockModel");

const UserModel = require("../models/userModel");

//getting a signup route
router.get("/register", (req, res) => {
  res.render("signup", { title: "signup page" });
});

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

// 1. GET route to display the Forgot Password form view
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Reset Password' });
});

// 2. POST route to handle the email submission for password reset
router.post('/forgot-password', async (req, res) => {
    // Logic: 
    // a) Validate email
    // b) Find user
    // c) Generate token
    // d) Email the reset link to the user
    // e) Redirect to a success page
    // ...
});

//  GOOGLE AUTH 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/Addsale");
    }
  }
);

// GITHUB AUTH 
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/Addsale");
    }
  }
);

//  FACEBOOK AUTH 
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/dashboard");
    } else {
      res.redirect("/Addsale");
    }
  }
);

module.exports = router;