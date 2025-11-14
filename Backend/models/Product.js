// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   carId: { type: String, required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   location: { type: String, required: true },
//   type: { type: String, required: true },
//   images: [{ type: String }], // array of image URLs
//   available: { type: Boolean,default:true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Product = mongoose.model('Product', productSchema);
// export default Product;


import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  carId: { type: Number, required: true }, // changed to Number
  name: { type: String, required: true },
  year: { type: Number, required: true },
  km_driven: { type: Number, required: true },
  fuel: { type: String, required: true },
  owner: { type: String, required: true },
  seats: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if needed
  location: { type: String, required: true },
  type: { type: String, required: true }, // car type
  price: { type: Number, required: true }, // ML predicted price
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }
  ],
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
