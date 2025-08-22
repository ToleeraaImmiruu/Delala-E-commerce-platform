// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
