const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {adminLogin,getAdminProfile, getDashboardStats,updateOrderStatus,getOrderById} = require("../controllers/adminAuthController");
const Order = require("../models/Order");
const User = require("../models/User");

// Get all orders
router.get(
  "/orders",
  auth,
  admin,
  async (req, res) => {
    const orders = await Order.find()
      .populate(
        "userId",
        "name email mobile district state address"
      )
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  }
);

// Get all users
router.get("/users",auth,admin,async(req,res)=>{
  const users = await User.find();
  res.json(users);
});
router.get("/me", auth, admin, getAdminProfile);
router.get("/stats", auth, admin, getDashboardStats);


router.post("/login", adminLogin);
router.put(
  "/orders/:id/status",
  auth,
  admin,
  updateOrderStatus
);
router.get(
  "/orders/:id",
  auth,
  admin,
  getOrderById
);


module.exports = router;