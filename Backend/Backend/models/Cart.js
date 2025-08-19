import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        car: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ✅ use "Product" not "Car"
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
