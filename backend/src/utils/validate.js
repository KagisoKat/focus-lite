const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeEmail(email) {
    if (typeof email !== "string") return null;
    const v = email.trim().toLowerCase();
    if (v.length < 3 || v.length > 254) return null;
    if (!EMAIL_RE.test(v)) return null;
    return v;
}

export function validatePassword(password) {
    if (typeof password !== "string") return { ok: false, reason: "Password must be a string" };

    const v = password;
    if (v.length < 8 || v.length > 72) {
        return { ok: false, reason: "Password must be 8-72 characters" };
    }

    if (!/[a-z]/.test(v)) return { ok: false, reason: "Password must include a lowercase letter" };
    if (!/[A-Z]/.test(v)) return { ok: false, reason: "Password must include an uppercase letter" };
    if (!/[0-9]/.test(v)) return { ok: false, reason: "Password must include a number" };
    if (!/[^A-Za-z0-9]/.test(v)) return { ok: false, reason: "Password must include a symbol" };

    return { ok: true };
}

export function validateTitle(title) {
    if (typeof title !== "string") return { ok: false, reason: "Title must be a string" };
    const v = title.trim();
    if (v.length < 1 || v.length > 200) return { ok: false, reason: "Title must be 1-200 characters" };
    return { ok: true, value: v };
}

export function validateStatus(status) {
    const allowed = new Set(["pending", "in_progress", "completed"]);
    if (typeof status !== "string") return { ok: false, reason: "Status must be a string" };
    if (!allowed.has(status)) return { ok: false, reason: "Status must be pending, in_progress, or completed" };
    return { ok: true };
}

export function isUuid(value) {
    return typeof value === "string" && UUID_RE.test(value);
}
