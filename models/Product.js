const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  isBestSeller: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);