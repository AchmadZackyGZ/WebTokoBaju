import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

// register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
        error: "Email sudah digunakan, silakan gunakan email lain.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const Token = generateToken(newUser);
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({
        message: "Gagal mendaftar pengguna baru",
        error: "Gagal menyimpan pengguna baru, silakan coba lagi.",
      });
    }
    res.status(201).json({
      message: "Pengguna berhasil didaftarkan",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
      },
      token: Token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal mendaftar pengguna baru",
      error: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan",
        error: "Email atau password salah.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Password salah",
        error: "Email atau password salah.",
      });
    }
    const Token = generateToken(user);
    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: Token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Gagal login",
      error: error.message,
    });
  }
};
