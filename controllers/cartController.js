const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  try {

    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({
      userId: req.user.id
    });

    // ✅ Create cart
    if (!cart) {

      cart = await Cart.create({
        userId: req.user.id,
        items: [
          {
            productId,
            quantity
          }
        ]
      });

      return res.json(cart);
    }

    // ✅ Check existing product
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId
    );

    // ✅ Increase quantity
    if (existingItem) {

      existingItem.quantity += quantity;

    } else {

      cart.items.push({
        productId,
        quantity
      });
    }

    await cart.save();

    res.json(cart);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Add to cart failed"
    });
  }
};

exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      userId: req.user.id
    }).populate("items.productId");

    res.json(cart || { items: [] });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Failed to fetch cart"
    });
  }
};

exports.updateCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      userId: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        msg: "Cart not found"
      });
    }

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    res.json(cart);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Update failed"
    });
  }
};

exports.removeItem = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      userId: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        msg: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      (i) =>
        i.productId.toString() !== req.params.id
    );

    await cart.save();

    res.json({
      msg: "Item removed"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Remove failed"
    });
  }
};