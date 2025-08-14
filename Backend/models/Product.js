import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  carId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: String, required: true },
  type: { type: String, required: true },
  images: [{ type: String }], // array of image URLs
  available: { type: Boolean,default:true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
