const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
     
console.log("Login Email:", email);

const admin = await Admin.findOne({ email });

console.log("Admin Found:", admin);    if (!admin) return res.status(400).json({ msg: "Admin not found" });
    
    const match = await bcrypt.compare(password, admin.password);

    console.log("Password Match:", match);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
        profileCompleted: true 
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id)
      .select("-password");

    if (!admin) {
      return res.status(404).json({
        msg: "Admin not found",
      });
    }

    res.json(admin);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();

    const revenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const recentOrders = await Order.find()
  .populate(
    "userId",
    "name email mobile district state address"
  )
  .sort({ createdAt: -1 })
  .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

   const placedOrders =
  await Order.countDocuments({
    status: "placed",
  });

const shippedOrders =
  await Order.countDocuments({
    status: "shipped",
  });

const deliveredOrders =
  await Order.countDocuments({
    status: "delivered",
  });

const cancelledOrders =
  await Order.countDocuments({
    status: "cancelled",
  });

res.status(200).json({
  totalUsers,
  totalOrders,
  totalProducts,
  revenue,

  placedOrders,
  shippedOrders,
  deliveredOrders,
  cancelledOrders,

  recentOrders,
  recentUsers,
});
  } catch (err) {
    console.log("Dashboard Error:", err);

    res.status(500).json({
      msg: "Dashboard Error",
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate(
        "userId",
        "name email mobile district state address"
      );

    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Server Error",
    });

  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Allow only valid statuses
    if (
      !["placed", "shipped", "delivered"].includes(status)
    ) {
      return res.status(400).json({
        msg: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      msg: "Order status updated successfully",
      order,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};

