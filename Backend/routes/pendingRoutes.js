import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import PendingProduct from "../models/PendingProduct.js";
import verifyToke from "../middleware/authoMiddleware.js";
import axios from "axios";

const router = express.Router();

router.post(
  "/pending-products",
  verifyToke,
  upload.array("products", 5),
  async (req, res) => {
    console.log("✅ Route hit! Req.user:", req.user);

    try {
      // Convert body to plain object
      const body = JSON.parse(JSON.stringify(req.body));
      console.log("🧾 Cleaned body:", body);
  
      const { name, year, km_driven, fuel, owner, seats } = body;

      // Validate required fields
      if (!name || !year || !km_driven || !fuel || !owner || !seats) {
        return res
          .status(400)
          .json({ success: 0, message: "Missing required fields" });
      }

      // Prepare correct payload for FastAPI
      const dataToSend = {
        name: String(name),
        year: Number(year),
        km_driven: Number(km_driven),
        fuel: String(fuel),
        owner: String(owner),
        seats: Number(seats),
      };

      console.log("📤 Sending data to FastAPI:", dataToSend);

    
      const response = await axios.post(
        "https://car-price-predictor-zw40.onrender.com/predict",
        dataToSend,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("FastAPI response:", response.data);

     
      const predictedPrice = Number(response.data["Predicted Price"].replace(/[^0-9.-]+/g, ''));

      if (!predictedPrice) {
        return res
          .status(500)
          .json({ success: 0, message: "No prediction returned from AI" });
      }
      // Map uploaded images safely
      const images = req.files?.map((f) => ({
        url: f.path,
        publicId: f.filename,
      })) || [];

      // Save pending product
      const pending = await PendingProduct.create({
        sellerId: req.user.id,
        name,
        year,
        km_driven,
        fuel,
        owner,
        seats,
        predictedPrice, // <-- match your DB field
        images,
        status: "pending",
      });

      console.log("Pending product saved:", pending);
      res.json({ success: 1, pending });
    } catch (error) {
      console.error(
        "❌ Pending upload error:",
        error.response?.data || error.message
      );
      res.status(500).json({ success: 0, message: "Server error" });
    }
  }
);

export default router;
