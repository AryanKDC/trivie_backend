import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    // page: {
    //   type: String,
    //   required: true,
    // },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image_gallery: {
      type: [String], // upload gallery
      required: true,
    },
    thumbnail_image: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      default: [],
      required: true,
    },
    the_challenge: {
      type: String,
      required: true,
    },
    our_solution: {
      type: String,
      required: false,
    },
    the_result: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
