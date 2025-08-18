// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
