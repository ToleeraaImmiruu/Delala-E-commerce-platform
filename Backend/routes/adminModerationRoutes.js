// routes/adminModerationRoutes.js
import express from "express";
import PendingProduct from "../models/PendingProduct.js";
import Product from "../models/Product.js";
import { requireAuth, requireRole } from "../middleware/authoMiddleware.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";
import { nextCarId } from "../utils/nextCarId.js";

const router = express.Router();

// List pending items for admin dashboard
router.get("/admin/pending-products", requireAuth, requireRole("admin"), async (req, res) => {
  const status = req.query.status || "pending"; // pending | approved | rejected
  const items = await PendingProduct.find({ status }).sort({ submittedAt: -1 });
  res.json({ items });
});

// Approve one
router.post("/admin/pending-products/:id/approve", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const notes = req.body?.adminNotes;

  const pending = await PendingProduct.findById(id);
  if (!pending || pending.status !== "pending") {
    return res.status(404).json({ message: "Item not found or not pending" });
  }

  // Move images from "delala/pending" → "delala/products"
  const moved = [];
  for (const img of pending.images) {
    const from = img.publicId; // e.g. "delala/pending/abc123"
    const baseName = from.split("/").pop();
    const to = `delala/products/${baseName}`;
    try {
      const r = await cloudinary.uploader.rename(from, to);
      moved.push({ url: r.secure_url, publicId: r.public_id });
    } catch (err) {
      console.error("Cloudinary rename failed", from, err?.message);
      // fallback: keep original url if rename fails
      moved.push({ url: img.url, publicId: img.publicId });
    }
  }

  const carId = await nextCarId();
  const product = await Product.create({
    carId,
    sellerId: pending.sellerId,
    name: pending.name,
    price: pending.price,
    location: pending.location,
    type: pending.type,
    images: moved.map(m => m.url),
    available: true
  });

  pending.status = "approved";
  pending.adminNotes = notes || pending.adminNotes;
  pending.decidedAt = new Date();
  await pending.save();

  res.json({ success: 1, product });
});

// Reject one (optionally delete images)
router.post("/admin/pending-products/:id/reject", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const notes = req.body?.adminNotes;

  const pending = await PendingProduct.findById(id);
  if (!pending || pending.status !== "pending") {
    return res.status(404).json({ message: "Item not found or not pending" });
  }

  // optional cleanup: delete assets from Cloudinary
  for (const img of pending.images) {
    try {
      await cloudinary.uploader.destroy(img.publicId);
    } catch (e) {
      console.warn("Failed to delete", img.publicId, e?.message);
    }
  }

  pending.status = "rejected";
  pending.adminNotes = notes || pending.adminNotes;
  pending.decidedAt = new Date();
  await pending.save();

  res.json({ success: 1, message: "Rejected" });
});

export default router;
