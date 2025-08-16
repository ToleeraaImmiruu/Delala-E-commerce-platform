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

      // Free text search

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Search query:", q);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },       // ✅ search in name
        { type: { $regex: q, $options: "i" } },       // ✅ search in type
        { location: { $regex: q, $options: "i" } },   // ✅ search in location
      ],
    });

    console.log("Found products:", products);
    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
