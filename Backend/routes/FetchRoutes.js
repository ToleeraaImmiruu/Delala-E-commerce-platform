// Get all pending products (admin only)
export default router.get("/pending1", verifyToke, async (req, res) => {
  try {
    // You can also check if req.user.role === 'admin' here
    const pending = await PendingProduct.find({ status: "pending" });
    res.json({ success: 1, pending });
  } catch (err) {
    console.error("Error fetching pending products:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});
