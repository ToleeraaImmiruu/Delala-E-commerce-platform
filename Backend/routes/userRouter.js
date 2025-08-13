import express from "express";
import verifyToke from "../middleware/authoMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
const router = express.Router();



//only the admin can access 
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

export default router;
