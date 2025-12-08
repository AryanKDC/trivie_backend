import express from "express";
import authRoutes from "./auth_routes.js";
import portfolioRoutes from "./portfolio_routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/portfolio", portfolioRoutes);

export default router;
