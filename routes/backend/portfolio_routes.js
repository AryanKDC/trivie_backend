import express from "express";
import {
  addPortfolio,
  getPortfolio,
  getPortfolioById,
  getAllCategories,
  editPortfolio,
  deletePortfolio,
} from "../../controllers/portfolio_controller.js";
import upload from "../../utils/upload.js";

const router = express.Router();

router.post(
  "/add-portfolio",
  upload.fields([
    { name: "thumbnail_image", maxCount: 1 },
    { name: "images_gallery" },
  ]),
  addPortfolio
);
router.post("/get", getPortfolio);
router.get("/categories", getAllCategories);
router.get("/get/:id", getPortfolioById);
router.put(
  "/edit/:id",
  upload.fields([
    { name: "thumbnail_image", maxCount: 1 },
    { name: "images_gallery" },
  ]),
  editPortfolio
);
router.delete("/delete/:id", deletePortfolio);

export default router;
