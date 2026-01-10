import { pool } from "../config/db.js";
import { httpError } from "../middleware/errorHandler.js";
import { isUuid, validateTitle, validateStatus } from "../utils/validate.js";

function parseLimit(value) {
    const n = Number.parseInt(String(value ?? ""), 10);
    if (Number.isNaN(n)) return 20;
    return Math.min(Math.max(n, 1), 100);
}

export async function listTasks(req, res, next) {
    try {
        const userId = req.user.id;
        const limit = parseLimit(req.query.limit);

        const cursorAt = req.query.cursor_at; // ISO timestamp string
        const cursorId = req.query.cursor_id; // UUID string

        let sql =
            `SELECT id, title, status, created_at
       FROM tasks
       WHERE user_id = $1`;

        const params = [userId];
        let p = 2;

        if (cursorAt && cursorId) {
            sql += ` AND (created_at, id) < ($${p++}, $${p++})`;
            params.push(cursorAt, cursorId);
        }

        sql += ` ORDER BY created_at DESC, id DESC LIMIT $${p++}`;
        params.push(limit);

        const result = await pool.query(sql, params);

        const rows = result.rows;
        const last = rows[rows.length - 1];

        res.json({
            ok: true,
            tasks: rows,
            page: {
                limit,
                next_cursor_at: last ? last.created_at : null,
                next_cursor_id: last ? last.id : null
            }
        });
    } catch (err) {
        next(err);
    }
}

export async function createTask(req, res, next) {
    try {
        const userId = req.user.id;
        const titleCheck = validateTitle(req.body?.title);

        if (!titleCheck.ok) {
            return next(httpError(422, "Validation failed", { title: titleCheck.reason }));
        }

        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, title, status, created_at`,
            [userId, titleCheck.value]
        );

        res.status(201).json({ ok: true, task: result.rows[0] });
    } catch (err) {
        next(err);
    }
}

export async function updateTask(req, res, next) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!isUuid(id)) return next(httpError(422, "Validation failed", { id: "Invalid task id" }));

        const fields = [];
        const values = [];
        let i = 1;

        if (req.body?.title !== undefined) {
            const titleCheck = validateTitle(req.body.title);
            if (!titleCheck.ok) return next(httpError(422, "Validation failed", { title: titleCheck.reason }));
            fields.push(`title = $${i++}`);
            values.push(titleCheck.value);
        }

        if (req.body?.status !== undefined) {
            const statusCheck = validateStatus(req.body.status);
            if (!statusCheck.ok) return next(httpError(422, "Validation failed", { status: statusCheck.reason }));
            fields.push(`status = $${i++}`);
            values.push(req.body.status);
        }

        if (fields.length === 0) return next(httpError(422, "Validation failed", { body: "Nothing to update" }));

        values.push(userId);
        values.push(id);

        const result = await pool.query(
            `UPDATE tasks
       SET ${fields.join(", ")}
       WHERE user_id = $${i++} AND id = $${i++}
       RETURNING id, title, status, created_at`,
            values
        );

        const updated = result.rows[0];
        if (!updated) return next(httpError(404, "Task not found"));

        res.json({ ok: true, task: updated });
    } catch (err) {
        next(err);
    }
}

export async function deleteTask(req, res, next) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!isUuid(id)) return next(httpError(422, "Validation failed", { id: "Invalid task id" }));

        const result = await pool.query(
            `DELETE FROM tasks
       WHERE user_id = $1 AND id = $2
       RETURNING id`,
            [userId, id]
        );

        if (!result.rows[0]) return next(httpError(404, "Task not found"));

        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}
