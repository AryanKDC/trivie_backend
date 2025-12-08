import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    images: {
      type: [String], // Array of strings to store image URLs or paths
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    title_one: {
      type: String,
      required: true,
    },
    description_one: {
      type: String,
      required: false,
    },
    title_two: {
      type: String,
      required: true,
    },
    description_two: {
      type: String,
      required: false,
    },
    title_three: {
      type: String,
      required: false,
    },
    description_three: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
