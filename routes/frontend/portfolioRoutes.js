import express from "express";
import {
  getFrontendPortfolios,
  getPortfolioById,
} from "../../controllers/portfolio_controller.js";

const router = express.Router();

router.get("/", getFrontendPortfolios);
router.get("/get/:id", getPortfolioById);
export default router;
