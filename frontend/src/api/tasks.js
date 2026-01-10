import { http } from "./http";

export async function listTasks({ limit = 20, cursorAt = null, cursorId = null } = {}) {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (cursorAt && cursorId) {
        params.set("cursor_at", cursorAt);
        params.set("cursor_id", cursorId);
    }

    const { data } = await http.get(`/api/tasks?${params.toString()}`);
    return data;
}

export async function createTask(title) {
    const { data } = await http.post("/api/tasks", { title });
    return data;
}

export async function updateTask(id, patch) {
    const { data } = await http.patch(`/api/tasks/${id}`, patch);
    return data;
}

export async function deleteTask(id) {
    const { data } = await http.delete(`/api/tasks/${id}`);
    return data;
}
