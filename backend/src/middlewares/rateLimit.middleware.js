import rateLimit from "express-rate-limit";

// ─── Helper ────────────────────────────────────────────────────────────────
// Builds a rate-limiter with a consistent JSON error shape that matches ApiError.
const createLimiter = ({ windowMs, max, message }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,  // Return rate-limit info in `RateLimit-*` headers
        legacyHeaders: false,   // Disable the deprecated `X-RateLimit-*` headers
        message: {
            success: false,
            message,
        },
    });

// ─── 1. Global / General API limiter ───────────────────────────────────────
// 100 requests per 15 minutes per IP — covers all routes as a safety net.
export const globalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 100,
    message: "Too many requests. Please try again after 15 minutes.",
});

// ─── 2. Auth limiter (login / register / change-password) ──────────────────
// Strict: 10 requests per 15 minutes — protects against brute-force attacks.
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 10,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
});

// ─── 3. Sensitive-action limiter (avatar / resume upload, job post, etc.) ──
// 20 requests per 15 minutes — prevents spam-creation of resources.
export const sensitiveLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 20,
    message: "Too many requests for this action. Please slow down and try again later.",
});

// ─── 4. Chat / messaging limiter ──────────────────────────────────────────
// 60 requests per minute — real-time chat needs breathing room but still capped.
export const chatLimiter = createLimiter({
    windowMs: 1 * 60 * 1000,       // 1 minute
    max: 60,
    message: "You're sending messages too quickly. Please wait a moment.",
});
