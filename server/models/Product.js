import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Pria", "Wanita", "Anak"],
      required: true,
    },
    sizes: [{ type: String, enum: ["S", "M", "L", "XL"] }],
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
