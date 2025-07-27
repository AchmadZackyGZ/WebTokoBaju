import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);
// Login user
router.post("/login", loginUser);
// Get user profile
router.get("/profile", authMiddleware, getUserProfile);
// Update user profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
