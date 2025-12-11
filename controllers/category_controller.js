import catchAsync from "../utils/catchAsync.js";
import Category from "../database/models/category_model.js";

export const addCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            status: false,
            message: "Category name is required",
        });
    }

    // Check if category exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({
            status: false,
            message: "Category with this name already exists",
        });
    }

    const category = await Category.create({
        name,
        description,
    });

    res.status(201).json({
        status: true,
        message: "Category added successfully",
        data: category,
    });
});

export const getCategories = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categories = await Category.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        status: true,
        message: "Categories fetched successfully",
        data: categories,
        pagination: {
            total,
            page: parseInt(page),
            totalPages,
            limit: parseInt(limit),
        },
    });
});

export const getCategoryById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            status: false,
            message: "Category not found",
        });
    }

    res.status(200).json({
        status: true,
        message: "Category fetched successfully",
        data: category,
    });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            status: false,
            message: "Category not found",
        });
    }

    if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                status: false,
                message: "Category with this name already exists",
            });
        }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();

    res.status(200).json({
        status: true,
        message: "Category updated successfully",
        data: category,
    });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        return res.status(404).json({
            status: false,
            message: "Category not found",
        });
    }

    res.status(200).json({
        status: true,
        message: "Category deleted successfully",
    });
});
