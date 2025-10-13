const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const UserModel = require("../models/userModel");

// GET  Registration form
router.get("/register-attendant", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("register-attendant", { title: "Register Attendant" });
});

// Manager registers new attendant
router.post("/register-attendant", ensureManager, async (req, res) => {
  try {
    const { fullName, age, nin, phone, email, gender, password } = req.body;

    const newUser = new UserModel({
      fullName,
      age,
      nin,
      phone,
      email,
      gender,
      role: "Attendants", // attendants role
    });

    await UserModel.register(newUser, password);

    res.redirect("/users"); 
  } catch (err) {
    console.error("Error registering attendant:", err);
    res.status(400).send("Failed to register attendant: " + err.message);
  }
});

// GET: Users (Manager only)
router.get("/users", ensureManager, async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await UserModel.find(query).lean();

    res.render("user-table", { users, search, role });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).send("Error retrieving users");
  }
});

// EDIT USER FORM
router.get("/users/edit/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).lean();
    if (!user) return res.status(404).send("User not found");
    res.render("user-edit", { user }); 
  } catch (err) {
    console.error("Error loading edit form:", err.message);
    res.status(500).send("Error loading edit form");
  }
});

// POST Update User
router.post("/users/edit/:id", async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { fullName, email, role });
    res.redirect("/users");
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Error updating user");
  }
});

// POST Delete User
router.post("/users/delete/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.redirect("/users");
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Error deleting user");
  }
});

// List all attendants 
router.get("/manage-users", ensureManager, async (req, res) => {
  try {
    const attendants = await UserModel.find({ role: "Attendants" });
    res.render("manage-users", { attendants });
  } catch (err) {
    res.status(500).send("Error loading users: " + err.message);
  }
});

// Promote attendant to manager
router.post("/promote/:id", ensureManager, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, { role: "Manager" });
    res.redirect("/manage-users");
  } catch (err) {
    res.status(400).send("Error promoting user: " + err.message);
  }
});

module.exports = router;
