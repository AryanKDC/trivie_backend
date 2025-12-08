import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./database/models/user_model.js";
import getConfigs from "./config.js";
import connectDB from "./database/db.js";

const configs = getConfigs();

const seedUser = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ user_name: "1" });

    if (existingUser) {
      console.log("User '1' already exists.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin", salt);

      await User.create({
        user_name: "1",
        password: hashedPassword,
        role_id: "admin",
        status: true,
      });
      console.log("User '1' created with password 'admin'.");
    }

    process.exit();
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
