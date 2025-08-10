import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from backend!");
});

router.get("/message", (req, res) => {
  res.json({ message: "Hello from API!" });
});

export default router;
