// import express from 'express';
// import upload from '../middleware/uploadMiddleware.js';
// import Product from '../models/Product.js';

// const router = express.Router();

// router.post('/upload', upload.array('products', 5), async (req, res) => {
// let product = await Product.find({});
// let carId;
//   if (product.length > 0) {
//     let lastProduct = product.slice(-1);
//     let last_product_array = lastProduct[0];
//    carId = Number(last_product_array.carId) + 1;
//   }
//   else {
//     carId=1
// }

//   console.log('req.body:', req.body);
//   try {
//     const {  name, price, location, type, available } = req.body;

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: 0, message: 'No images uploaded' });
//     }
    
//     // Validate required fields
//     if (!name) {
//       return res.status(400).json({ success: 0, message: 'Missing product name' });
//     }
//     if (!price ) {
//       return res.status(400).json({ success: 0, message: 'Missing product price ' });
//     }
//     if (!location) {
//       return res.status(400).json({ success: 0, message: 'Missing product location ' });
//     }
//     if (!type) {
//       return res.status(400).json({ success: 0, message: 'Missing product type' });
//     }

//     // Extract image URLs from Cloudinary upload
//     const imageUrls = req.files.map(file => file.path);

//     // Create new product document
//     const newProduct = new Product({
// carId,
//       name,
//       price: Number(price),
//       location,
//       type,
//       available: available === undefined ? true : available === 'true', // parse boolean from string
//       images: imageUrls
//     });
//             console.log("saved")
//     // Save product to DB
//     const savedProduct = await newProduct.save();

//     res.json({
//       success: 1,
//       product: savedProduct,
//       images: imageUrls
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ success: 0, message: 'Server error' });
//   }
// });

// //Creating API for deleting from th db 
// router.post('/delete',async(req,res)=>{
//   await Product.findOneAndDelete({carId:req.body.carId});
//   console.log("removed from the Database");
//   res.json({ 
//     success: true,
//   })
// })

// //creating get all products 

// router.get('/allCar', async (req, res) => {
//   try {
//     let products = await Product.find({})
//     console.log('all products fetched');
//     res.send(products)
//   }
//   catch {
//   console.error('Error fetching products:', error);
//   res.status(500).json({ success: 0, message: 'Server error' });
//   }
//   })


// // edit the Cars 
//   router.put('/edit/:carId', async (req, res) => {
//   const { carId } = req.params;
//   const updateData = req.body;

//   try {
//     const updatedProduct = await Product.findOneAndUpdate(
//       { carId: carId }, // filter by carId
//       updateData,       // update fields
//       { new: true }     // return the updated document
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ success: 0, message: 'Product not found' });
//     }

//     res.json({ success: 1, product: updatedProduct });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ success: 0, message: 'Server error' });
//   }
// });

// export default router;


import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Product from "../models/Product.js";
import axios from "axios";

const router = express.Router();

// -------------------- Upload Product with ML Prediction --------------------
router.post("/upload", upload.array("products", 5), async (req, res) => {
  try {
    // Get last product to generate carId
    const lastProduct = await Product.findOne().sort({ carId: -1 });
    const carId = lastProduct ? lastProduct.carId + 1 : 1;

    console.log("req.body:", req.body);

    
    const { name, year, km_driven, fuel, owner, seats } = req.body;
console.log(req.body);
    // Validate required fields
    if (!name || !year || !km_driven || !fuel || !owner || !seats ) {
      return res.status(400).json({ success: 0, message: "Missing required fields" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No images uploaded" });
    }
    // Call FastAPI ML to get predicted price
    const mlResponse = await axios.post(
      "https://car-price-predictor-zw40.onrender.com/predict",
      {
        name,
        year: Number(year),
        km_driven: Number(km_driven),
        fuel,
        owner,
        seats: Number(seats)
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("FastAPI response:", mlResponse.data);

    // Extract numeric predicted price
    const predictedPrice = Number(mlResponse.data["Predicted Price"].replace(/[^0-9.-]+/g, ""));
    if (!predictedPrice || isNaN(predictedPrice)) {
      return res.status(500).json({ success: 0, message: "Failed to get predicted price" });
    }

    // Map images
    const imageUrls = req.files.map(f => ({ url: f.path, publicId: f.filename }));

    // Create new product
    const newProduct = new Product({
      carId,
      name,
      year: Number(year),
      km_driven: Number(km_driven),
      fuel,
      owner,
      seats: Number(seats),
      price: predictedPrice,  // ML price
      available: available === undefined ? true : available === "true",
      images: imageUrls
    });

    const savedProduct = await newProduct.save();

    res.json({ success: 1, product: savedProduct, images: imageUrls });

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message || error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Delete Product --------------------
router.post("/delete", async (req, res) => {
  try {
    await Product.findOneAndDelete({ carId: req.body.carId });
    console.log("Removed from the Database");
    res.json({ success: 1, message: "Product deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Get All Products --------------------
router.get("/allCar", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("All products fetched");
    res.json({ success: 1, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

// -------------------- Edit Product --------------------
router.put("/edit/:carId", async (req, res) => {
  const { carId } = req.params;
  const updateData = req.body;

  try {
    // Optional: if key ML fields are updated, call ML API again
    if (updateData.name || updateData.year || updateData.km_driven || updateData.fuel || updateData.owner || updateData.seats) {
      const product = await Product.findOne({ carId });
      if (!product) return res.status(404).json({ success: 0, message: "Product not found" });

      const mlResponse = await axios.post(
        "https://car-price-predictor-zw40.onrender.com/predict",
        {
          name: updateData.name || product.name,
          year: Number(updateData.year || product.year),
          km_driven: Number(updateData.km_driven || product.km_driven),
          fuel: updateData.fuel || product.fuel,
          owner: updateData.owner || product.owner,
          seats: Number(updateData.seats || product.seats)
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const predictedPrice = Number(mlResponse.data["Predicted Price"].replace(/[^0-9.-]+/g, ""));
      if (predictedPrice && !isNaN(predictedPrice)) updateData.price = predictedPrice;
    }

    // Update product
    const updatedProduct = await Product.findOneAndUpdate({ carId }, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ success: 0, message: "Product not found" });

    res.json({ success: 1, product: updatedProduct });
  } catch (error) {
    console.error("Edit error:", error.response?.data || error.message || error);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});

export default router;


