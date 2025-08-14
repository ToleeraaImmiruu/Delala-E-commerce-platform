// routes/pendingRoutes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import PendingProduct from "../models/PendingProduct.js";
import verifyToke  from "../middleware/authoMiddleware.js";

const router = express.Router();

// Sellers submit listing (multipart/form-data with images)
router.post("/pending-products", verifyToke, upload.array("products", 5), async (req, res) => {
 console.log("Route hit! Req.user:", req.user);
  console.log("Files received:", req.files);
  console.log("Body received:", req.body);
  
  try {
    const { name, price, location, type } = req.body;

    if (!req.files?.length) 
      return res.status(400).json({ success: 0, message: "No images uploaded" });

    if (!name || !price || !location || !type)
      return res.status(400).json({ success: 0, message: "Missing required fields" });

    const images = req.files.map(f => ({
      url: f.path,
      publicId: f.filename,
    }));

    const doc = await PendingProduct.create({
      sellerId: req.user.id,
      name,
      price: Number(price),
      location,
      type,
      images,
      status:  "pending",
    });
    console.log("Pending product saved:", doc);
    res.json({ success: 1, pending: doc });
  } catch (e) {
    console.error("Pending upload error:", e);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});


export default router;
