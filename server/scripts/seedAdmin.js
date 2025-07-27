import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      name: "masteradmin",
      email: "master@admin123",
      password: hashedPassword,
      isAdmin: true,
    });
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }
    // Save the admin user to the database
    const savedAdmin = await adminUser.save();
    if (savedAdmin) {
      console.log("Admin user seeded successfully:", savedAdmin);
    } else {
      console.error("Failed to seed admin user.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
};

seedAdmin();
// Export the seedAdmin function for use in other scripts
export default seedAdmin;
