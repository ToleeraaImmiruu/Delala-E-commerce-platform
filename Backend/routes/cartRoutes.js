// routes/cartRoutes.js
import express from "express";
import Cart from "../models/Cart.js";
import Car from "../models/Product.js";
import verifyToken  from "../middleware/authoMiddleware.js";

const router = express.Router();

// 🛒 Add item to cart
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { carId, quantity } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 });
    }

    const itemIndex = cart.items.findIndex(i => i.car.toString() === carId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ car: carId, quantity, price: car.price });
    }

    cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Get user cart
router.get("/", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.car");
  res.json(cart);
});

// ❌ Remove item
router.delete("/remove/:carId", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter(i => i.car.toString() !== req.params.carId);
  cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  await cart.save();
  res.json(cart);
});

export default router;
