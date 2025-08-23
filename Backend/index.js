// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


import uploadRoutes from './routes/uploadRoutes.js';
import userRouter from './routes/userRouter.js'
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

// Middlewares
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use('/images', express.static('uploads'));
app.use('/api', uploadRoutes);
app.use('/api/',userRouter)
app.use("/", dashboardRoutes);

app.use("/api", pendingRoutes);
app.use("/api", PublicView);

//order and cart 
app.use("/api", Order);
app.use("/api", Cart);
// app.use("/api", Chat);
// app.use("/api", Pending);
app.use("/api", adminModerationRoutes);
// Start server
const PORT = process.env.PORT  || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
