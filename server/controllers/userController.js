import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Get profile user
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      profilePicture: user.profilePicture || "", // Pastikan selalu string
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User tidak ditemukan");
  }
});

// @desc    Update profile user
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User tidak ditemukan");
  }
});
