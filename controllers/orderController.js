const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const sendSMS = require("../utils/sendSMS");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        msg: "Cart is empty",
      });
    }

    const {
      paymentMethod,
      deliveryAddress,
    } = req.body;

    const items = cart.items.map(
      (item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      })
    );

    const totalAmount = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user.id,

      items,

      totalAmount,

      paymentMethod,

      deliveryAddress,

      status: "placed",
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      msg: "Order placed successfully",
      order,
    });

  } catch (err) {

    console.log("Place Order Error:", err);

    res.status(500).json({
      msg: "Order Failed",
    });

  }
};

exports.getMyOrders = async (req,res)=>{
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

exports.cancelOrder = async (req,res)=>{
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ❌ Prevent cancelling delivered orders
    if (order.status === "delivered") {
      return res.status(400).json({ msg: "Cannot cancel delivered order" });
    }
    if (order.userId.toString() !== req.user.id) {
  return res.status(403).json({ msg: "Unauthorized" });
}
    
    if (order.status === "cancelled") {
      return res.status(400).json({ msg: "Order already cancelled" });
    }

    if (order.status !== "placed") {
  return res.status(400).json({
    msg: "Order cannot be cancelled after shipping"
  });
}
    
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    
    order.status = "cancelled";
    await order.save();

    res.json({ msg: "Order cancelled successfully", order });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error cancelling order" });
  }
};


exports.updateDeliveryAddress = async (req, res) => {
  try {
    const {
      name,
      mobile,
      address,
      district,
      state,
    } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    // Only owner can update
    if (
      order.userId.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }

    // Don't allow after shipping
    if (
      order.status === "shipped" ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        msg:
          "Cannot update address after shipping",
      });
    }

    order.deliveryAddress = {
      name,
      mobile,
      address,
      district,
      state,
    };

    await order.save();

    res.json({
      msg:
        "Delivery address updated successfully",
      order,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg:
        "Error updating delivery address",
    });
  }
};