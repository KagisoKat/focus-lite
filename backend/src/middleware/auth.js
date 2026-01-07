import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ ok: false, error: "Missing or invalid Authorization header" });
    }

    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = { id: payload.userId, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, error: "Invalid or expired token" });
    }
}
