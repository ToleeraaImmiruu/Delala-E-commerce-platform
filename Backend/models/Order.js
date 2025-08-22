// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // The user who placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Items in the order
    items: [
      {
        car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Total price of the order
    total: { type: Number, required: true },

    // Order status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Create and export the Order model
const Order = mongoose.model("Order", orderSchema);
export default Order;
