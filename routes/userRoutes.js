const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const UserModel = require("../models/userModel");
// const userModel = require("../models/userModel");
// const Attendant = require("../models/register-attendantModel");
// router.get("/users", async (req, res) => {
//   try {
//     const users = await UserModel.find().lean();
//     res.render("user-table", { users });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving users");
//   }
// });

// GET - Registration form
router.get("/register-attendant", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("register-attendant", { title: "Register Attendant" });
});

// POST - Handle form submission (Manager only)
// router.post(
//   "/register-attendant",
//   ensureAuthenticated,
//   ensureManager,
//   async (req, res) => {
//     try {
//       const { fullName, age, nin, phone, email, gender, password } = req.body;

//       const existing = await UserModel.findOne({ email });
//       if (existing) {
//         return res.status(400).send("Attendant already exists");
//       }

//       const newAttendant = new UserModel({
//         fullName,
//         age,
//         nin,
//         phone,
//         email,
//         gender,
//         role: "Attendant",
//       });

//       await UserModel.register(newAttendant, password); // ⬅️ This hashes the password

//       res.redirect("/users");
//     } catch (error) {
//       console.error("Error registering attendant:", error);
//       res.status(500).send("Error registering attendant.");
//     }
//   }
// );

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
      role: "Attendants", // force attendants role
    });

    await UserModel.register(newUser, password);

    res.redirect("/users"); // or wherever you want after success
  } catch (err) {
    console.error("Error registering attendant:", err);
    res.status(400).send("Failed to register attendant: " + err.message);
  }
});

// GET: Users (Manager only)
router.get("/users", async (req, res) => {
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
// List all attendants (for manager to manage)
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
