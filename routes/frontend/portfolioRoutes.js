import express from "express";
import {
  getFrontendPortfolios,
  getFrontendPortfoliosByCategory,
  getPortfolioById,
} from "../../controllers/portfolio_controller.js";

const router = express.Router();

router.get("/", getFrontendPortfolios);
router.get("/get/:id", getPortfolioById);
router.get("/get", getFrontendPortfoliosByCategory)
export default router;
