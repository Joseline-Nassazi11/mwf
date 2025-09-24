const mongoose = require("mongoose");

const attendantSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  age: { type: Number, min: 18, required: true },
  nin: { type: String, unique: true, required: true }, // National ID
  phone: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  role: { type: String, default: "Attendant" },
  password: { type: String, required: true }, // Will be hashed later
  dateRegistered: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendant", attendantSchema);
