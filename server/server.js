// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); //⬅️ dibutuhkan di ES Module (jika pakai "type": "module" di package.json)

// Ini agar file di folder uploads bisa diakses publik
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: false,
  })
);
app.use(express.json()); // Parse JSON bodies

// Routes
// api/products
app.use("/api/products", productRoutes);

// api/upload
app.use("/api/upload", uploadRoutes);

// api/user
app.use("/api/auth", userRoutes);

// api/orders
app.use("/api/orders", orderRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
