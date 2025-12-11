import crypto from "crypto";
import User from "../database/models/user_model.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Sanitize email input (trim and lowercase)
        const sanitizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) {
            return res.json({ message: "If your email exists, you will receive a reset link" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;  //30 mins
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const html = `
        <p>You requested a password reset.</p>
        <p>
            Click <a href="${resetURL}">here</a> to reset your password.<br />
            This link is valid for 30 minutes.
        </p>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                html,
            });

            res.json({ message: "A reset link has been sent to your email" });
        } catch (emailError) {
            console.error("Email sending error:", emailError);

            // Rollback: Remove the token since email failed
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(500).json({ message: "Failed to send reset email. Please try again later." });
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "Password and confirmation are required" });
        }

        // Sanitize password input (trim)
        const sanitizedPassword = password.trim();
        const sanitizedConfirmPassword = confirmPassword.trim();

        // Check if passwords match
        if (sanitizedPassword !== sanitizedConfirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // valid token
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Invalidate token immediately (single-use token)
        // This prevents reuse even if password update fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(sanitizedPassword, salt);
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};