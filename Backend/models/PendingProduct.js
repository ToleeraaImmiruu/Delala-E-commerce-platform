import mongoose from "mongoose";

const pendingProductSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // same fields the seller fills
  name: { type: String, required: true },
  predictedPrice: { type: String, required: true },
  year: { type: Number, required: true },
  km_driven: { Number },
  fuel: { String },
  owner: { String  },
  seats: { Number },
  // store both url + publicId so we can rename/move/delete on approval/reject
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],

  // moderation fields
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  adminNotes: { type: String },
  submittedAt: { type: Date, default: Date.now },
  decidedAt: { type: Date }
});

export default mongoose.model("PendingProduct", pendingProductSchema);
