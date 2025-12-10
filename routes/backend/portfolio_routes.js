import express from "express";
import {
  addPortfolio,
  getPortfolio,
  getPortfolioById,
  getAllTags,
} from "../../controllers/portfolio_controller.js";
import upload from "../../utils/upload.js";

const router = express.Router();

router.post(
  "/add-portfolio",
  upload.fields([
    { name: "thumbnail_image", maxCount: 1 },
    { name: "images_gallery", maxCount: 20 },
  ]),
  addPortfolio
);
router.post("/get", getPortfolio);
router.get("/tags", getAllTags);
router.get("/get/:id", getPortfolioById);

export default router;
