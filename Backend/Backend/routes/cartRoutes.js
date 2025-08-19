// routes/cartRoutes.js
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; // your Product model
import verifyToken from "../middleware/authoMiddleware.js";

const router = express.Router();

/**
 * 🛒 Add item to cart
 */
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { carId, quantity } = req.body;

    // check if product exists
    const car = await Product.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // find existing cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 });
    }

    // check if item already in cart
    const itemIndex = cart.items.findIndex(
      (i) => i.car.toString() === carId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        car: carId,
        quantity,
        price: car.price,
      });
    }

    // recalc total
    cart.total = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📦 Get user cart
 */
router.get("/getCar", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.car"); // ✅ works now

    if (!cart) {
      return res.json({ message: "Cart is empty", items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * ❌ Remove item from cart
 */
router.delete("/remove/:carId", verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // filter out the removed item
    cart.items = cart.items.filter(
      (i) => i.car.toString() !== req.params.carId
    );

    // recalc total
    cart.total = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
