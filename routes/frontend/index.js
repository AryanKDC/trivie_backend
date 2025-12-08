import express from "express";
import portfolioRoutes from "./portfolioRoutes.js";

const router = express.Router();

// Define frontend routes here
router.get("/", (req, res) => {
  res.send("Frontend API is running");
});

router.use("/portfolio", portfolioRoutes);

export default router;
