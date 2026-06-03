const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },

  profileCompleted: { type: Boolean, default: false },

  mobile: String,
  age: Number,
  address: String,
  state: String,
  district: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);