import catchAsync from "../utils/catchAsync.js";
import User from "../database/models/user_model.js";
import bcrypt from "bcryptjs";

export const addUser = catchAsync(async (req, res, next) => {
    const { user_name, password, email, role_id } = req.body;

    if (!user_name || !password || !email) {
        return res.status(400).json({
            status: false,
            message: "Username, password and email are required",
        });
    }

    // Check if user exists
    const existingUser = await User.findOne({
        $or: [{ user_name }, { email }]
    });

    if (existingUser) {
        return res.status(400).json({
            status: false,
            message: "User with this username or email already exists",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        user_name,
        password: hashedPassword,
        email,
        email,
        role_id: role_id || "user",
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
        status: true,
        message: "User added successfully",
        data: user,
    });
});

export const getUsers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users,
        pagination: {
            total,
            page: parseInt(page),
            totalPages,
            limit: parseInt(limit),
        },
    });
});

export const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        status: true,
        message: "User fetched successfully",
        data: user,
    });
});

export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { user_name, password, email, role_id, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    if (user_name && user_name !== user.user_name) {
        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User with this username already exists",
            });
        }
    }

    if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                status: false,
                message: "User with this email already exists",
            });
        }
    }

    user.user_name = user_name || user.user_name;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;

    if (status !== undefined) {
        user.status = status;
    }

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        status: true,
        message: "User deleted successfully",
    });
});
