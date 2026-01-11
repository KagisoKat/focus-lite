import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 50,               // 50 requests / 15 min per IP
    standardHeaders: "draft-7",
    legacyHeaders: false
});
