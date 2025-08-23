// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import uploadRoutes from './routes/uploadRoutes.js';
import userRouter from './routes/userRouter.js';
import pendingRoutes from "./routes/pendingRoutes.js";
import adminModerationRoutes from "./routes/adminModerationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import PublicView from "./routes/productRoutes.js";
import Cart from "./routes/cartRoutes.js";
import Order from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoute.js";
import Chat from "./routes/ChatRoute.js";
// import Pending from "./routes/FetchRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://delala-e-commerce-platform-frontend.onrender.com" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// JSON middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/images', express.static('uploads'));
app.use('/api', uploadRoutes);
app.use('/api/', userRouter);
app.use("/", dashboardRoutes);
app.use("/api", pendingRoutes);
app.use("/api", PublicView);

// Order and cart
app.use("/api", Order);
app.use("/api", Cart);
// app.use("/api", Chat);
// app.use("/api", Pending);
app.use("/api", adminModerationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
