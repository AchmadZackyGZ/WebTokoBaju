// src/pages/Profile.tsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../services/apiClient";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>(""); // ⬅️ Tambahkan ini
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setProfilePicture(res.data.profilePicture || ""); // Store the profile picture URL
        setPreview(res.data.profilePicture || "");
      } catch (err: any) {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Gagal mengambil data profil"
        );
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file) {
      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input dengan ref
        }
        return;
      }

      // Validasi ukuran file (maksimal 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB dalam bytes
      if (file.size > maxSize) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input dengan ref
        }
        return;
      }

      // Jika validasi lolos, set preview dan file
      setPreview(URL.createObjectURL(file));
      setPhoto(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await apiClient.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProfilePicture(res.data.imageUrl); // simpan URL gambar
        console.log("Image uploaded:", res.data.imageUrl);
        console.log("Current profilePicture state:", profilePicture);
      } catch (error: any) {
        toast.error("gagal upload foto", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: { name: string; profilePicture?: string } = { name };

      if (profilePicture) {
        payload.profilePicture = profilePicture;
      }

      const res = await apiClient.put("/auth/profile", payload);

      toast.success("Profil berhasil diperbarui");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  // try {
  //   // upload image jika file baru diunggah
  //   if (photo) {
  //     // Sekarang pengecekan lebih sederhana
  //     const formData = new FormData();
  //     formData.append("image", photo);

  //     const res = await apiClient.put(
  //       "/auth/profile",
  //       { name, profilePicture },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     toast.success("Profil berhasil diperbarui");
  //     localStorage.setItem("user", JSON.stringify(res.data));
  //     navigate("/");
  //   }

  // // update profile
  // await axios.put(
  //   "/api/users/profile",
  //   {
  //     name,
  //     profilePicture: photoUrl || "", // Sesuaikan dengan field di backend
  //   },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );
  // const updatedUser = {
  //   ...JSON.parse(localStorage.getItem("user") || "{}"),
  //   name,
  //   profilePicture: photoUrl,
  // };
  // localStorage.setItem("user", JSON.stringify(updatedUser));

  // window.dispatchEvent(new Event("storage"));

  // toast.success("Profil berhasil diperbarui");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Gagal menyimpan profil");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  console.log("Current states:", { name, email, preview });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Edit Profil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Nama</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Email (tidak bisa diubah)
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              value={email}
              disabled
              placeholder="Email Anda"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Foto Profil</label>
            {preview && (
              <div className="mb-3">
                <img
                  src={preview || profilePicture || "/default-avatar.png"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-md"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-2">
              Format yang diizinkan: JPG, JPEG, PNG (maksimal 5MB)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </div>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
