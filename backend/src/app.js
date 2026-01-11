import express from "express";
import cors from "cors";
import helmet from "helmet";
import { dbPing } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authLimiter } from "./middleware/rateLimit.js";

export function createApp() {
    const app = express();

    app.use(helmet());

    const isProd = process.env.NODE_ENV === "production";
    const allowedOrigin = process.env.CORS_ORIGIN; // e.g. http://localhost:8080

    app.use(
        cors({
            origin: isProd ? allowedOrigin : true,
            credentials: true
        })
    );

    app.use(express.json({ limit: "100kb" }));

    app.get("/health", (req, res) => {
        res.json({ ok: true, service: "backend", ts: new Date().toISOString() });
    });

    app.get("/api/health", (req, res) => res.type("text").send("ok"));

    app.get("/db-health", async (req, res, next) => {
        try {
            const row = await dbPing();
            res.json({ ok: true, db: row.ok === 1 });
        } catch (err) {
            next(err);
        }
    });

    app.use("/api/auth", authLimiter, authRoutes);
    app.use("/api/tasks", tasksRoutes);

    app.use(errorHandler);

    return app;
}
