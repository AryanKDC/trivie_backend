import express from "express";
import authRoutes from "./auth_routes.js";
import portfolioRoutes from "./portfolio_routes.js";

import categoryRoutes from "./category_routes.js";
import userRoutes from "./user_routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/category", categoryRoutes);
router.use("/user", userRoutes);

export default router;
