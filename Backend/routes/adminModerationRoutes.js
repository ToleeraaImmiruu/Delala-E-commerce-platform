// routes/adminModerationRoutes.js
import express from "express";
import PendingProduct from "../models/PendingProduct.js";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/authoMiddleware.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";
import { nextCarId } from "../utils/nextCarId.js";
import mongoose from "mongoose";
import verifyToke from "../middleware/authoMiddleware.js";
import { getAllUsers, updateUserRole, toggleUserStatus, deleteUser } from "../controllers/userController.js";
const router = express.Router();

// Approve a pending product
router.post("/approve-product/:id", verifyToke, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: 0, message: "Access denied" });
    }

    const pending = await PendingProduct.findById(req.params.id);
    if (!pending)
      return res.status(404).json({ success: 0, message: "Pending product not found" });

    // IMPORTANT FIXES HERE:
    const newProduct = await Product.create({
      carId: pending._id,            // FIXED (NOT the schema object)
      sellerId: pending.sellerId,
      name: pending.name,
      predictedPrice: Number(pending.predictedPrice),

      year: pending.year,            // FIXED
      km_driven: pending.km_driven,
      fuel: pending.fuel,            // FIXED
      owner: pending.owner,
      seats: pending.seats,

      images: pending.images.map(img => ({
        url: img.url,
        publicId: img.publicId
      })),                           // FIXED

      available: true
    });

    pending.status = "approved";
    pending.decidedAt = new Date();
    await pending.save();

    res.json({ success: 1, message: "Product approved", product: newProduct });

  } catch (err) {
    console.error("Approve product error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

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
// Seller edits their own product
router.put("/edit1/:id", verifyToke, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(
      'pro',product
    )
    if (!product) {
      return res.status(404).json({ success: 0, message: "Product not found here" });
    }

    // Check if logged-in seller is the product owner
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: 0, message: "You can only edit your own product" });
    }

    // Update allowed fields
    const { name, price, location, type, images } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (location) product.location = location;
    if (type) product.type = type;
    if (images && images.length > 0) {
      product.images = images;
    }

    await product.save();
    res.json({ success: 1, message: "Product updated successfully", product });
  } catch (err) {
    console.error("Edit product error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// Seller deletes their own product
router.delete("/delete1/:id", verifyToke, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: 0, message: "Product not found" });
    }

    // Check if logged-in seller is the product owner
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: 0, message: "You can only delete your own product" });
    }

    // Delete images from Cloudinary if needed
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        try {
          const publicId = imgUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Failed to delete image from Cloudinary:", err.message);
        }
      }
    }

    await product.deleteOne();
    res.json({ success: 1, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
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

// Only admin can manage users
router.get("/getall", verifyToke, requireRole("admin"), getAllUsers);
router.put("/:id/role", verifyToke, requireRole("admin"), updateUserRole);
router.patch("/:id/status", verifyToke, requireRole("admin"), toggleUserStatus);
router.delete("/:id", verifyToke, requireRole("admin"), deleteUser);


export default router;
