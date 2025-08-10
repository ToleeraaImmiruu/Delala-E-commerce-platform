// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";



dotenv.config(); // Load .env variables
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Use test routes
app.use("/", testRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
