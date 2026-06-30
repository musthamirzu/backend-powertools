const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    // NEW
    deliveryAddress: {
      name: String,
      mobile: String,
      address: String,
      district: String,
      state: String,
    },

    // NEW
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      default: "COD",
    },

    // NEW
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "placed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);