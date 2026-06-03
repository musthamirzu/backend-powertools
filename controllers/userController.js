const sendSMS = require("../utils/sendSMS");

const User = require("../models/User");
const Admin = require("../models/Admin");

exports.completeProfile = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...req.body,
        profileCompleted: true
      },
      {
        returnDocument: "after"
      }
    );
     console.log(req.user);
    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    await sendSMS(
      `New User Registered!
Name: ${user.name}
Phone: ${user.mobile}
Address: ${user.address}
State: ${user.state}
District: ${user.district}`,
      process.env.ADMIN_PHONE
    );

    res.json({
      msg: "Profile completed successfully",
      user
    });

  } catch (err) {

    console.log("🔥 PROFILE ERROR:", err);

    res.status(500).json({
      msg: "Error completing profile"
    });
  }
};




exports.getMe = async (req, res) => {
  try {
    let account;

    // 🔥 Check role from token
    if (req.user.role === "admin") {
      account = await Admin.findById(req.user.id);
    } else {
      account = await User.findById(req.user.id);
    }

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.json(account);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching profile" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // ❌ hide password
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching users" });
  }
};