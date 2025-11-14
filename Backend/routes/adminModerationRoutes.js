// routes/adminModerationRoutes.js
import express from "express";
import PendingProduct from "../models/PendingProduct.js";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/authoMiddleware.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";
import { nextCarId } from "../utils/nextCarId.js";

import verifyToke from "../middleware/authoMiddleware.js";
import { 
  getAllUsers, 
  updateUserRole, 
  toggleUserStatus, 
  deleteUser 
} from "../controllers/userController.js";

const router = express.Router();


// =====================================================
// ADMIN APPROVES PRODUCT → NOW WITH ML FIELDS INCLUDED
// =====================================================
router.post("/approve-product/:id", verifyToke, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: 0, message: "Access denied" });
    }

    const pending = await PendingProduct.findById(req.params.id);
    if (!pending) return res.status(404).json({ success: 0, message: "Pending product not found" });

    // ⭐ NEW: Includes ML fields (year, km_driven, fuel, owner, seats)
    const newProduct = await Product.create({
      carId: pending._id.toString(),
      sellerId: pending.sellerId,
      name: pending.name,
      price: pending.price,
      location: pending.location,
      type: pending.type,

      // ML fields
      year: pending.year,
      km_driven: pending.km_driven,
      fuel: pending.fuel,
      owner: pending.owner,
      seats: pending.seats,

      images: pending.images.map(img => img.url),
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


// =====================================================
// REJECT PRODUCT
// =====================================================
router.post("/reject-product/:id", verifyToke, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: 0, message: "Access denied" });
    }

    const pending = await PendingProduct.findById(req.params.id);
    if (!pending) return res.status(404).json({ success: 0, message: "Pending product not found" });

    pending.status = "rejected";
    pending.decidedAt = new Date();
    pending.adminNotes = req.body.notes || "";
    await pending.save();

    res.json({ success: 1, message: "Product rejected" });
  } catch (err) {
    console.error("Reject product error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});


// =====================================================
// SELLER EDITS THEIR OWN PRODUCT
// (add ML fields support but NO logic changed)
// =====================================================
router.put("/edit1/:id", verifyToke, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: 0, message: "Product not found here" });
    }

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: 0, message: "You can only edit your own product" });
    }

    const { 
      name, price, location, type, images,
      year, km_driven, fuel, owner, seats // ML fields
    } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (location) product.location = location;
    if (type) product.type = type;

    // ⭐ ML fields
    if (year) product.year = year;
    if (km_driven) product.km_driven = km_driven;
    if (fuel) product.fuel = fuel;
    if (owner) product.owner = owner;
    if (seats) product.seats = seats;

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


// =====================================================
// DELETE PRODUCT
// =====================================================
router.delete("/delete1/:id", verifyToke, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: 0, message: "Product not found" });
    }

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ success: 0, message: "You can only delete your own product" });
    }

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


// =====================================================
// GET ALL PENDING FOR ADMIN
// =====================================================
router.get("/pending", verifyToke, async (req, res) => {
  try {
    const pending = await PendingProduct.find({ status: "pending" });
    res.json({ success: 1, pending });
  } catch (err) {
    console.error("Error fetching pending products:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});


// =====================================================
// ADMIN USER MANAGEMENT
// =====================================================
router.get("/getall", verifyToke, requireRole("admin"), getAllUsers);
router.put("/:id/role", verifyToke, requireRole("admin"), updateUserRole);
router.patch("/:id/status", verifyToke, requireRole("admin"), toggleUserStatus);
router.delete("/:id", verifyToke, requireRole("admin"), deleteUser);

export default router;
