import mongoose from "mongoose";
import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, qty, price } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productObjectId, // ✅ FIX
            qty,
            price,
          },
        ],
      });
    } else {
      const index = cart.items.findIndex(
        (i) => i.product.toString() === productId
      );

      if (index > -1) {
        cart.items[index].qty += qty;
      } else {
        cart.items.push({
          product: productObjectId, // ✅ FIX
          qty,
          price,
        });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
