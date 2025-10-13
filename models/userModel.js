const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: String }, // optional for Manager sign-up
  nin: { type: String }, // optional for Manager
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  role: {
    type: String,
    enum: ["SuperAdmin", "Manager", "Attendants", "Warehouse", "Loading"],
    default: "Attendants",
  },
});

signupSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("UserModel", signupSchema);
