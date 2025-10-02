// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const signupSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: Number,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//   },
//   // password: {
//   //   type: String,
//   //   required: true,
//   // },
//   role: {
//     type: String,
//     enum: ["Manager", "Attendants"],
//     default: "Attendants",
//     required: true,
//   },
// });

// signupSchema.plugin(passportLocalMongoose, {
//     usernameField:"email"
// });
// module.exports = mongoose.model("UserModel", signupSchema);

// models/userModel.js
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
    enum: ["Manager", "Attendants", "Warehouse", "Loading"],
    default: "Attendants",
  },
});

signupSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("UserModel", signupSchema);
