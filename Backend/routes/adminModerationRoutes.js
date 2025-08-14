// routes/adminModerationRoutes.js
import express from "express";
import PendingProduct from "../models/PendingProduct.js";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/authoMiddleware.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";
import { nextCarId } from "../utils/nextCarId.js";
import verifyToke from "../middleware/authoMiddleware.js";

const router = express.Router();

// Approve a pending product
router.post("/approve-product/:id", verifyToke, async (req, res) => {
  try {
    // Make sure only admin can approve
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: 0, message: "Access denied" });
    }

    const pending = await PendingProduct.findById(req.params.id);
    if (!pending) return res.status(404).json({ success: 0, message: "Pending product not found" });

    // Create a new product in the main Product collection
    const newProduct = await Product.create({
      carId: pending._id.toString(), // optional unique ID
      sellerId: pending.sellerId,
      name: pending.name,
      price: pending.price,
      location: pending.location,
      type: pending.type,
      images: pending.images.map(img => img.url), // only URLs
    });

    // Update pending product status (optional) and decidedAt
    pending.status = "approved";
    pending.decidedAt = new Date();
    await pending.save();

    res.json({ success: 1, message: "Product approved", product: newProduct });
  } catch (err) {
    console.error("Approve product error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
})

// Reject a pending product
router.post("/reject-product/:id", verifyToke, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: 0, message: "Access denied" });
    }

    const pending = await PendingProduct.findById(req.params.id);
    if (!pending) return res.status(404).json({ success: 0, message: "Pending product not found" });

    // Optionally store admin notes
    pending.status = "rejected";
    pending.decidedAt = new Date();
    pending.adminNotes = req.body.notes || "";
    await pending.save();

    // Or you can remove it completely:
    // await PendingProduct.findByIdAndDelete(req.params.id);

    res.json({ success: 1, message: "Product rejected" });
  } catch (err) {
    console.error("Reject product error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});


// Get all pending products (admin only)
router.get("/pending", verifyToke, async (req, res) => {
  try {
    // You can also check if req.user.role === 'admin' here
    const pending = await PendingProduct.find({ status: "pending" });
    res.json({ success: 1, pending });
  } catch (err) {
    console.error("Error fetching pending products:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

export default router;
