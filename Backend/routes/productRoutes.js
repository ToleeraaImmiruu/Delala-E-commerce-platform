// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Public route: get all approved products
router.get("/public", async (req, res) => {
  try {
    const products = await Product.find(); // fetch all from Product collection
    res.json({ success: 1, products });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

export default router;
