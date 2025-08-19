import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import verifyToken from "../middleware/authoMiddleware.js";

const router = express.Router();

// 🛒 Place order from cart
router.post("/place", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.car");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const orderItems = cart.items.map(item => ({
      car: item.car._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      total,
    });

    await order.save();

    // Clear the cart after placing order
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Get orders for current user
router.get("/myOrders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("items.car");
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔄 Update order status (for admin)
router.put("/updateStatus/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
