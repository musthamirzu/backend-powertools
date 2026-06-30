const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {placeOrder, cancelOrder,getUserOrders, getOrderTracker,updateOrderStatus,} = require("../controllers/orderController");

router.post("/place",auth,placeOrder);

router.put("/cancel/:id", auth, cancelOrder);
router.get("/:id/tracker", auth, getOrderTracker);
router.get("/my-orders", auth, getUserOrders);

module.exports = router;