const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name:String,
  email: String,
  password: String,
  role:String
});

module.exports = mongoose.model("Admin", adminSchema);