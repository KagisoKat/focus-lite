import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import { normalizeEmail, validatePassword } from "../utils/validate.js";
import { httpError } from "../middleware/errorHandler.js";

export async function register(req, res, next) {
    try {
        const email = normalizeEmail(req.body?.email);
        const passCheck = validatePassword(req.body?.password);

        if (!email || !passCheck.ok) {
            return next(
                httpError(422, "Validation failed", {
                    email: email ? null : "Invalid email",
                    password: passCheck.ok ? null : passCheck.reason
                })
            );
        }

        const passwordHash = await bcrypt.hash(req.body.password, 12);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
            [email, passwordHash]
        );

        res.status(201).json({ ok: true, user: result.rows[0] });
    } catch (err) {
        if (err && err.code === "23505") {
            return next(httpError(409, "Email already registered"));
        }
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const email = normalizeEmail(req.body?.email);
        const password = req.body?.password;

        if (!email || typeof password !== "string") {
            return next(httpError(422, "Validation failed", { email: email ? null : "Invalid email" }));
        }

        const result = await pool.query(
            `SELECT id, email, password_hash
       FROM users
       WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];
        if (!user) return next(httpError(401, "Invalid credentials"));

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return next(httpError(401, "Invalid credentials"));

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            env.jwtSecret,
            { expiresIn: "7d" }
        );

        res.json({ ok: true, token });
    } catch (err) {
        next(err);
    }
}
