import mongoose from "mongoose";
import getConfigs from "../config.js";

const connectDB = async () => {
  const configs = getConfigs();
  try {
    const conn = await mongoose.connect(configs.mongo.url);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
