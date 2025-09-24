const express = require("express");
const router = express.Router();

const UserModel = require("../models/userModel");
const Attendant = require("../models/register-attendantModel");
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
router.get("/register-attendant", (req, res) => {
  res.render("register-attendant", { title: "Register Attendant" });
});

// POST - Handle form submission
router.post("/register-attendant", async (req, res) => {
  try {
    const { fullName, age, nin, phone, email, gender, password } = req.body;

    const newAttendant = new Attendant({
      fullName,
      age,
      nin,
      phone,
      email,
      gender,
      password, // TODO: hash before saving
    });

    await newAttendant.save();
    res.redirect("/users");
  } catch (error) {
    console.error("Error registering attendant:", error);
    res.status(500).send("Error registering attendant.");
  }
});

// GET: Users with optional search + role filter
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

    res.render("user-table", {
      users,
      search,
      role,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).send("Error retrieving users");
  }
});

module.exports = router;
