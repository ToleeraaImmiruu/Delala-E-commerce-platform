// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Set up Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'delala', // folder name in Cloudinary
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage });
// export default upload;

// middleware/uploadMiddleware.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'delala/pending',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
    // optional: public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
  }),
});

const upload = multer({ storage });
export default upload;
export { cloudinary };
