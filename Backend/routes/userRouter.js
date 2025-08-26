import express from "express";
import verifyToke from "../middleware/authoMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
const router = express.Router();



//only the admin can access for any things 
router.get("/admin",verifyToke,authorizeRoles("admin"), (req,res) => {
  res.json({message:"Welcome Admin"})
})
//user can access
router.get("/seller", verifyToke,authorizeRoles("admin","seller"), (req,res) => {
  res.json({message:"welcome seller"})
})
router.get("/buyer", verifyToke,authorizeRoles("admin","buyer"), (req,res) => {
  res.json({message:"welcome buyer"})
})
// seller-dashboard route
router.get("/seller-dashboard", verifyToke, (req, res) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json({ message: "Welcome seller" });
});
// buyer-dashboard route
router.get("/buyer-dashboard", verifyToke, (req, res) => {
  if (req.user.role !== "buyer" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json({ message: "Welcome buyer" });
});

export default router;
