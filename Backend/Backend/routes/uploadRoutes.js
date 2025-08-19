import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/upload', upload.array('products', 5), async (req, res) => {
let product = await Product.find({});
let carId;
  if (product.length > 0) {
    let lastProduct = product.slice(-1);
    let last_product_array = lastProduct[0];
   carId = Number(last_product_array.carId) + 1;
  }
  else {
    carId=1
}

  console.log('req.body:', req.body);
  try {
    const {  name, price, location, type, available } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: 'No images uploaded' });
    }
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: 0, message: 'Missing product name' });
    }
    if (!price ) {
      return res.status(400).json({ success: 0, message: 'Missing product price ' });
    }
    if (!location) {
      return res.status(400).json({ success: 0, message: 'Missing product location ' });
    }
    if (!type) {
      return res.status(400).json({ success: 0, message: 'Missing product type' });
    }

    // Extract image URLs from Cloudinary upload
    const imageUrls = req.files.map(file => file.path);

    // Create new product document
    const newProduct = new Product({
carId,
      name,
      price: Number(price),
      location,
      type,
      available: available === undefined ? true : available === 'true', // parse boolean from string
      images: imageUrls
    });
            console.log("saved")
    // Save product to DB
    const savedProduct = await newProduct.save();

    res.json({
      success: 1,
      product: savedProduct,
      images: imageUrls
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: 0, message: 'Server error' });
  }
});

//Creating API for deleting from th db 
router.post('/delete',async(req,res)=>{
  await Product.findOneAndDelete({carId:req.body.carId});
  console.log("removed from the Database");
  res.json({ 
    success: true,
  })
})

//creating get all products 

router.get('/allCar', async (req, res) => {
  try {
    let products = await Product.find({})
    console.log('all products fetched');
    res.send(products)
  }
  catch {
  console.error('Error fetching products:', error);
  res.status(500).json({ success: 0, message: 'Server error' });
  }
  })


// edit the Cars 
  router.put('/edit/:carId', async (req, res) => {
  const { carId } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { carId: carId }, // filter by carId
      updateData,       // update fields
      { new: true }     // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: 0, message: 'Product not found' });
    }

    res.json({ success: 1, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: 0, message: 'Server error' });
  }
});

export default router;
