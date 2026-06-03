const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });

    // ✅ Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        msg: "Email already registered"
      });
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      email,
      password: hashed,
      profileCompleted: false
    });

    // ✅ Create token immediately
    const token = jwt.sign(
      {
        id: user._id,
        role: "user"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // ✅ Send token + user
    res.status(201).json({
      msg: "Registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: "user",
        profileCompleted: false
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Register error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Check admin first
    let account = await Admin.findOne({ email });
    let role = "admin";

    if (!account) {
      account = await User.findOne({ email });
      role = "user";
    }

    if (!account) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: account._id,
        email: account.email,
        role,

        // 🔥 KEY LOGIC
        profileCompleted:
          role === "admin" ? true : account.profileCompleted
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
};

