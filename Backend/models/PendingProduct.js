import mongoose from "mongoose";

const pendingProductSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: { type: String, required: true },
  predictedPrice: { type: String, required: true },
  year: { type: Number, required: true },
  km_driven: { type: Number },
  fuel: { type: String },
  owner: { type: String },
  seats: { type: Number },

  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminNotes: { type: String },
  submittedAt: { type: Date, default: Date.now },
  decidedAt: { type: Date },
});

export default mongoose.model("PendingProduct", pendingProductSchema);
