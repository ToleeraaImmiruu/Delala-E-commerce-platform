import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import verifyToken from "../middleware/authoMiddleware.js";
import Car from "../models/Car.js"; 
const router = express.Router();

// 🛒 Place order from cart


// 🛒 Place order from cart
router.post("/place/:carId", verifyToken, async (req, res) => {
  try {
    const { carId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.car");
    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    const item = cart.items.find(i => i.car._id.toString() === carId);
    if (!item) return res.status(404).json({ message: "Car not found in cart" });

    const finalQty = quantity || item.quantity;

    const order = new Order({
      user: req.user.id,
      items: [
        {
          car: item.car._id,
          quantity: finalQty,
          price: item.price,
        },
      ],
      total: item.price * finalQty,
    });

    await order.save();

    cart.items = cart.items.filter(i => i.car._id.toString() !== carId);
    cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await cart.save();

    res.json({ message: "Order placed successfully", order });
  } catch
  (err) {
    console.error(err); // Always log full error
    res.status(500).json({ error: err.message });
  }
});
// 📦 Get orders for the logged-in user
router.get("/myOrders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.car");
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔄 Update order status (admin only)
router.put("/updateStatus/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    // Check valid status
    const allowedStatus = ["Pending", "Confirmed", "Shipped", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Status updated", order });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
