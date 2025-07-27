import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: {
          type: String,
          enum: ["S", "M", "L", "XL"],
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Uncomment if you want to add payment details
    // totalPrice: { type: Number, required: true },
    // paymentMethod: {
    //   type: String,
    //   enum: ["Credit Card", "PayPal", "Bank Transfer"],
    //   required: true,
    // },
    // paymentResult: {s
    //   id: { type: String },
    //   status: { type: String },
    //   update_time: { type: String },
    //   email_address: { type: String },
    // },

    totalPrice: { type: Number, required: true },

    // Pembayaran
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // Metode pembayaran
    paymentMethod: {
      type: {
        method: {
          type: String,
          enum: ["Credit Card", "PayPal", "Bank Transfer"],
          required: true,
        },
        details: {
          cardNumber: { type: String }, // untuk Credit Card
          bankName: { type: String }, // untuk Bank Transfer
          accountNumber: { type: String }, // untuk Bank Transfer
          email: { type: String }, // untuk PayPal
        },
      },
      required: true,
    },

    // Pengiriman
    isShipped: {
      type: Boolean,
      default: false,
    },
    shippedAt: {
      type: Date,
    },

    // Pembatalan
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },

    // Total harga pesanan
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // status saat ini
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Paid", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
