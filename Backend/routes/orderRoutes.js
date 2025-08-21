import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import verifyToken from "../middleware/authoMiddleware.js";

const router = express.Router();

// 🛒 Place order from cart
// routes/order.js
router.post("/place/:carId", verifyToken, async (req, res) => {
  const { carId } = req.params;
  const { quantity } = req.body;
  const car = await Car.findById(carId).populate("seller");
  if (!car) return res.status(404).json({ message: "Car not found" });

  const order = new Order({
    buyer: req.user.id,
    seller: car.seller._id,
    car: car._id,
    quantity: quantity || 1,
    price: car.price,
    total: car.price * (quantity || 1),
  });

  await order.save();
  res.json({ message: "Order placed successfully", order });
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
