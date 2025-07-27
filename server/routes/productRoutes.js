import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { isAdmin, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// public routes
// Route to get all products
router.get("/", getAllProducts);
// Route to get a single product by ID
router.get("/:id", getProductById);

// admin routes
// Route to create a new product
router.post("/", authMiddleware, isAdmin, createProduct);
// Route to update an existing product by ID
router.put("/:id", authMiddleware, isAdmin, updateProduct);
// Route to delete a product by ID
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default router;
