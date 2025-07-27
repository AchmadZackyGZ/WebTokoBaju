import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  cancelOrder,
  updateOrderToPaid,
  updateOrderToShipped,
} from "../controllers/orderController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// user create order
router.post("/", authMiddleware, createOrder);

// user lihat pesanan saya
router.get("/my-orders", authMiddleware, getMyOrders);

// ADMIN lihat semua pesanan
router.get("/all-orders", authMiddleware, isAdmin, getAllOrders);

// user update order to payed
router.put("/:id/pay", authMiddleware, updateOrderToPaid);

// user cancel order
router.put("/:id/cancel", authMiddleware, cancelOrder);

router.put("/:id/ship", authMiddleware, isAdmin, updateOrderToShipped);

export default router;
