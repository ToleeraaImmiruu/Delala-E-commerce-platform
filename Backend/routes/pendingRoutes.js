import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import PendingProduct from "../models/PendingProduct.js";
import verifyToke from "../middleware/authoMiddleware.js";
import axios from "axios";

const router = express.Router();

router.post(
  "/pending-products",
  verifyToke,
  upload.array("products", 5),   // MUST MATCH FRONTEND
  async (req, res) => {
    try {
      const { name, year, km_driven, fuel, owner, seats } = req.body;

      if (!name || !year || !km_driven || !fuel || !owner || !seats) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      // Prepare data for ML model
      const mlPayload = {
        name,
        year: Number(year),
        km_driven: Number(km_driven),
        fuel,
        owner,
        seats: Number(seats),
      };

      // Call FastAPI
      const mlRes = await axios.post(
        "https://car-price-predictor-zw40.onrender.com/predict",
        mlPayload
      );

      let predictedPrice = mlRes.data?.predicted_price || mlRes.data?.price;

      // Convert if needed
      predictedPrice = Number(predictedPrice);

      if (isNaN(predictedPrice)) {
        return res.status(500).json({
          success: 0,
          message: "AI prediction response invalid",
        });
      }

      // Map uploaded Cloudinary images
      const images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      // Save product
      const pending = await PendingProduct.create({
        sellerId: req.user.id,
        name,
        year,
        km_driven,
        fuel,
        owner,
        seats,
        predictedPrice,
        images,
        status: "pending",
      });

      return res.json({ success: 1, pending });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      return res.status(500).json({ success: 0, message: err.message });
    }
  }
);

export default router;
