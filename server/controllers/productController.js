import Product from "../models/Product.js";

// get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Berhasil mengambil semua produk",
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "error ketika mengambil semua produk",
      error: error.message,
    });
  }
};

// get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }
    res.status(200).json({
      message: "Berhasil mengambil produk " + id,
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "error ketika mengambil produk dengan id " + id,
      error: error.message,
    });
  }
};

// create new product
export const createProduct = async (req, res) => {
  const { name, description, price, category, sizes, stock, imageUrl } =
    req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      sizes,
      stock,
      imageUrl,
    });
    const savedProduct = await newProduct.save();
    if (!savedProduct) {
      return res.status(400).json({
        message: "Produk gagal disimpan",
        error: "Gagal menyimpan produk, silakan coba lagi.",
      });
    }
    res.status(201).json({
      message: "Produk Berhasil Dibuat",
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Produk gagal dibuat",
      error: error.message,
    });
  }
};

// put update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, sizes, stock, imageUrl } =
    req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        sizes,
        stock,
        imageUrl,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }
    res.status(200).json({
      message: "Produk berhasil diperbarui",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ketika memperbarui produk",
      error: error.message,
    });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }
    res.status(200).json({
      message: "Produk berhasil dihapus",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ketika menghapus produk",
      error: error.message,
    });
  }
};
