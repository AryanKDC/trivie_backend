import Portfolio from "../database/models/portfolio_model.js";

export const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
