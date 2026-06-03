const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {placeOrder, cancelOrder} = require("../controllers/orderController");

router.post("/place",auth,placeOrder);

router.put("/cancel/:id", auth, cancelOrder);
module.exports = router;