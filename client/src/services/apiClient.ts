// client/src/services/apiClient.ts
import axios from "axios";
import { toast } from "react-hot-toast";
import { getToken, clearToken } from "../utils/auth.ts";

const token = getToken();

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
  headers: {
    // Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

// Interceptor untuk menambahkan token sebelum request dikirim
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani error 401 (Unauthorized)
    if (error.response?.status === 401) {
      clearToken();
      toast.error("Sesi telah berakhir, silakan login kembali");
      window.location.href = "/login";
    }

    // Tangani error lainnya
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Terjadi kesalahan pada server");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
