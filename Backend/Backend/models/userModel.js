import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer" 
  },

  isActive: { type: Boolean, default: true }, // 🔹 admin can deactivate users

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
