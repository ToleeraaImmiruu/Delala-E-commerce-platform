// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   carId: { type: String, required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   location: { type: String, required: true },
//   type: { type: String, required: true },
//   images: [{ type: String }], // array of image URLs
//   available: { type: Boolean,default:true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Product = mongoose.model('Product', productSchema);
// export default Product;

import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Product from "../models/Product.js";
import axios from "axios";

const router = express.Router();

// -------------------- Upload Product with ML Prediction --------------------
router.post("/upload", upload.array("products", 5), async (req, res) => {
  try {
    // Get last product to generate carId
    const lastProduct = await Product.findOne().sort({ carId: -1 });
    const carId = lastProduct ? lastProduct.carId + 1 : 1;

    console.log("req.body:", req.body);

    
    const { name, year, km_driven, fuel, owner, seats } = req.body;
console.log(req.body);
    // Validate required fields
    if (!name || !year || !km_driven || !fuel || !owner || !seats ) {
      return res.status(400).json({ success: 0, message: "Missing required fields" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No images uploaded" });
    }
    // Call FastAPI ML to get predicted price
    const mlResponse = await axios.post(
      "https://car-price-predictor-zw40.onrender.com/predict",
      {
        name,
        year: Number(year),
        km_driven: Number(km_driven),
        fuel,
        owner,
        seats: Number(seats)
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("FastAPI response:", mlResponse.data);

    // Extract numeric predicted price
    const predictedPrice = Number(mlResponse.data["Predicted Price"].replace(/[^0-9.-]+/g, ""));
    if (!predictedPrice || isNaN(predictedPrice)) {
      return res.status(500).json({ success: 0, message: "Failed to get predicted price" });
    }

    // Map images
    const imageUrls = req.files.map(f => ({ url: f.path, publicId: f.filename }));

    // Create new product
    const newProduct = new Product({
      carId,
      name,
      year: Number(year),
      km_driven: Number(km_driven),
      fuel,
      owner,
      seats: Number(seats),
      price: predictedPrice,  // ML price
      available: available === undefined ? true : available === "true",
      images: imageUrls
    });

    const savedProduct = await newProduct.save();

    res.json({ success: 1, product: savedProduct, images: imageUrls });

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message || error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Delete Product --------------------
router.post("/delete", async (req, res) => {
  try {
    await Product.findOneAndDelete({ carId: req.body.carId });
    console.log("Removed from the Database");
    res.json({ success: 1, message: "Product deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Get All Products --------------------
router.get("/allCar", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("All products fetched");
    res.json({ success: 1, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Edit Product --------------------
router.put("/edit/:carId", async (req, res) => {
  const { carId } = req.params;
  const updateData = req.body;

  try {
    // Optional: if key ML fields are updated, call ML API again
    if (updateData.name || updateData.year || updateData.km_driven || updateData.fuel || updateData.owner || updateData.seats) {
      const product = await Product.findOne({ carId });
      if (!product) return res.status(404).json({ success: 0, message: "Product not found" });

      const mlResponse = await axios.post(
        "https://car-price-predictor-zw40.onrender.com/predict",
        {
          name: updateData.name || product.name,
          year: Number(updateData.year || product.year),
          km_driven: Number(updateData.km_driven || product.km_driven),
          fuel: updateData.fuel || product.fuel,
          owner: updateData.owner || product.owner,
          seats: Number(updateData.seats || product.seats)
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const predictedPrice = Number(mlResponse.data["Predicted Price"].replace(/[^0-9.-]+/g, ""));
      if (predictedPrice && !isNaN(predictedPrice)) updateData.price = predictedPrice;
    }
