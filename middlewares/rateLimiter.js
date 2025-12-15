import rateLimit from "express-rate-limit";

// Rate limiter for forgot password endpoint
// 5 requests per 15 minutes per IP
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many password reset requests, please try again later",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            message: "Too many password reset requests, please try again later",
        });
    },
});

// Rate limiter for reset password endpoint
// 3 requests per 15 minutes per IP
export const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per windowMs
    message: "Too many password reset attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: "Too many password reset attempts, please try again later",
        });
    },
});
