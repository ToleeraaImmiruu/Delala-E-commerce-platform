// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import verifyToken  from "../middleware/authoMiddleware.js";

const router = express.Router();

// ✅ Checkout
router.post("/checkout", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.car");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: req.user.id,
      items: cart.items,
      total: cart.total
    });

    await order.save();
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👀 Get user orders
router.get("/", verifyToken, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.car");
  res.json(orders);
});

export default router;
