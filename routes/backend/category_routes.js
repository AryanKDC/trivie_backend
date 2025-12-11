import express from "express";
import {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../../controllers/category_controller.js";

const router = express.Router();

router.post("/add-category", addCategory);
router.get("/get", getCategories);
router.get("/get/:id", getCategoryById);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
