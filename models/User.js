const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
  type: String,
  required: false,
  default: null,
},
  role: { type: String, default: "user" },

  profileCompleted: { type: Boolean, default: false },
  googleId: String,
  mobile: String,
  age: Number,
  address: String,
  state: String,
  district: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);