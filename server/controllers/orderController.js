import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, paymentMethod } = req.body;
    const userId = req.user.id;

    if (
      !userId ||
      !items?.length ||
      !shippingAddress ||
      !totalPrice ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Mohon lengkapi semua data pesanan (items, shipping, payment).",
      });
    }

    // Validasi isi paymentMethod
    if (
      !["Credit Card", "PayPal", "Bank Transfer"].includes(paymentMethod.method)
    ) {
      return res.status(400).json({
        message: "Metode pembayaran tidak valid.",
      });
    }

    const newOrder = new Order({
      user: userId,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat pesanan, silakan coba lagi.",
      error: error.message,
    });
  }
};

// ✅ GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pesanan, silakan coba lagi.",
      error: error.message,
    });
  }
};

// ✅ GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil semua pesanan.",
      error: error.message,
    });
  }
};

// ✅ UPDATE TO SHIPPED (ADMIN ONLY)
export const updateOrderToShipped = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: "Pesanan belum dibayar." });
    }

    order.isShipped = true;
    order.shippedAt = Date.now();
    order.status = "Shipped";

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Pesanan berhasil dikirim.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengubah status pesanan.",
      error: error.message,
    });
  }
};

// ✅ UPDATE TO PAID (USER)
export const updateOrderToPaid = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Pesanan sudah dibayar." });
    }

    const paymentMethod = req.body.paymentMethod;

    if (
      !paymentMethod ||
      !["Credit Card", "PayPal", "Bank Transfer"].includes(paymentMethod.method)
    ) {
      return res
        .status(400)
        .json({ message: "Metode pembayaran tidak valid." });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = paymentMethod;
    order.status = "Paid";

    const updatedOrder = await order.save();

    // Kirim email pemberitahuan ke pembeli
    const buyer = await User.findById(order.user);
    if (buyer?.email) {
      await sendEmail({
        to: buyer.email,
        subject: "Pesanan Anda telah dibayar",
        text: `Halo ${buyer.name},\n\nPesanan #${order._id} telah berhasil dibayar. Terima kasih atas pembelian Anda!\n\nJika ada pertanyaan, silakan hubungi kami.\n\nTerima kasih.`,
      });
    }

    res.status(200).json({
      message: "Pembayaran berhasil.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui status pembayaran.",
      error: error.message,
    });
  }
};

// ✅ CANCEL ORDER (USER)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const userIsAdmin = req.user.isAdmin;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }

    // 🔒 Hanya admin atau pemilik pesanan yang boleh batalkan
    if (!userIsAdmin && order.user.toString() !== userId) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    // ❌ Jika sudah dibayar atau dikirim, tidak bisa dibatalkan
    if (order.isPaid || order.isShipped) {
      return res.status(400).json({
        message:
          "Pesanan yang sudah dibayar atau dikirim tidak dapat dibatalkan.",
      });
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    order.status = "Cancelled";

    const updatedOrder = await order.save();

    // Kirim email pemberitahuan ke pembeli
    const buyer = await User.findById(order.user);
    if (buyer?.email) {
      await sendEmail({
        to: buyer.email,
        subject: "pesanan anda telah dibatalkan",
        text: `Halo ${buyer.name},\n\nPesanan #${order._id} telah dibatalkan. Jika ini kesalahan, silakan hubungi kami.\n\nTerima kasih.`,
      });
    }

    res.status(200).json({
      message: "Pesanan berhasil dibatalkan.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membatalkan pesanan.",
      error: error.message,
    });
  }
};
