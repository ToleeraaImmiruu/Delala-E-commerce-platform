import express from "express";
import verifyToken from "../middleware/authoMiddleware.js";

const router = express.Router();

// Buyer dashboard
router.get("/buyer-dashboard", verifyToken, (req, res) => {
  if (req.user.role !== "buyer" && req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  res.json({ message: "Welcome buyer" });
});

// Seller dashboard
router.get("/seller-dashboard", verifyToken, (req, res) => {
  if (req.user.role !== "seller" && req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  res.json({ message: "Welcome seller" });
});

// Admin dashboard
router.get("/admin-dashboard", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  res.json({ message: "Welcome admin" });
});

export default router;
