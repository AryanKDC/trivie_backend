import express from "express";
import { forgotPassword, resetPassword, changePassword } from "../../controllers/password_controller.js";
import { forgotPasswordLimiter, resetPasswordLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword);
router.post("/change-password", changePassword);

export default router;