
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const admin = await Admin.create({
      email: "musthamirzu15@gmail.com",
      password: hashedPassword,
      role: "admin" // 🔥 IMPORTANT
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

createAdmin();