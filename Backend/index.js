// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoute.js";
import uploadRoutes from './routes/uploadRoutes.js';
import userRouter from './routes/userRouter.js'

import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Use test routes
app.use("/", testRoutes);
app.use("/api/auth", authRoutes);
app.use('/images', express.static('uploads'));
app.use('/api', uploadRoutes);
app.use('/api/',userRouter)
app.use("/", dashboardRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
