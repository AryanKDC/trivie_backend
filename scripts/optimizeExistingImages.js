
import mongoose from "mongoose";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Connect DB
import connectDB from "../database/db.js";
import Portfolio from "../database/models/portfolio_model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const optimizeImage = async (filePath) => {
    if (!filePath) return null;
    // If already webp, skip
    if (filePath.endsWith(".webp")) return filePath;

    // Resolve absolute path
    // Database stores "uploads/filename.jpg"
    // Assuming filePath is relative to project root
    const absolutePath = path.resolve(rootDir, filePath);

    if (!fs.existsSync(absolutePath)) {
        console.warn(`File not found: ${filePath}`);
        return filePath; // Keep original path if file missing
    }

    try {
        const dir = path.dirname(absolutePath);
        const name = path.parse(absolutePath).name;
        const newFilename = `${name}.webp`;
        const newPath = path.join(dir, newFilename);
        const relativeNewPath = path.join("uploads", newFilename).replace(/\\/g, "/");

        console.log(`Optimizing: ${filePath} -> ${relativeNewPath}`);

        // Compress
        await sharp(absolutePath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(newPath);

        // Delete original?
        // Let's delete it to save space as requested
        try {
            fs.unlinkSync(absolutePath);
        } catch (e) {
            console.warn(`Failed to delete original: ${absolutePath}`);
        }

        return relativeNewPath;
    } catch (err) {
        console.error(`Failed to optimize ${filePath}:`, err);
        return filePath;
    }
};

const run = async () => {
    await connectDB();
    console.log("Connected to DB");

    const portfolios = await Portfolio.find();
    console.log(`Found ${portfolios.length} portfolios`);

    for (const p of portfolios) {
        let modified = false;

        // Optimize thumbnail
        if (p.thumbnail_image) {
            const newThumb = await optimizeImage(p.thumbnail_image);
            if (newThumb !== p.thumbnail_image) {
                p.thumbnail_image = newThumb;
                modified = true;
            }
        }

        // Optimize gallery
        if (p.image_gallery && p.image_gallery.length > 0) {
            const newGallery = [];
            for (const img of p.image_gallery) {
                const newImg = await optimizeImage(img);
                newGallery.push(newImg);
                if (newImg !== img) modified = true;
            }
            p.image_gallery = newGallery;
        }

        if (modified) {
            await p.save();
            console.log(`Updated portfolio: ${p.title}`);
        }
    }

    console.log("Done!");
    process.exit();
};

run();
