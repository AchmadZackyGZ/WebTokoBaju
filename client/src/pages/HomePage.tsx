import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import { handleAxiosError } from "../utils/errorHandler";
import type { Product } from "../types/product";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/products");
        if (!response.data || !Array.isArray(response.data.products)) {
          throw new Error("Data produk tidak valid");
        }
        setProducts(response.data.products || []);
        console.log("Produk response:", response.data);
      } catch (error: unknown) {
        const errorMessage = handleAxiosError(error);
        setError(errorMessage);
        console.error("DETAIL ERROR:", error);
        console.error("gagal mengambil product:", errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Toko Baju</h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat produk...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada produk tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white shadow rounded p-4 hover:shadow-md transition"
            >
              <img
                src={
                  product.imageUrl
                    ? `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`
                    : "/no-image.png"
                }
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-indigo-600 font-bold mt-1">
                Rp{product.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
