import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "PendingProduct", required: true },

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  predictedPrice: { type: Number, required: true },

  year: { type: Number, required: true },
  km_driven: { type: Number, required: true },
  fuel: { type: String, required: true },
  owner: { type: String, required: true },
  seats: { type: Number, required: true },

  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ],

  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
