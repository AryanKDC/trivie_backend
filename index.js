import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./database/db.js";
import getConfigs from "./config.js";

// Get configs
const configs = getConfigs();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors(configs.cors));
app.use(cookieParser());
app.use(morgan(configs.morgan.logStyle));
app.use("/uploads", express.static("uploads"));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
import frontendRoutes from "./routes/frontend/index.js";
import backendRoutes from "./routes/backend/index.js";

app.use("/api/frontend", frontendRoutes);
app.use(configs.server.appBaseUrl, backendRoutes);

const PORT = configs.server.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
