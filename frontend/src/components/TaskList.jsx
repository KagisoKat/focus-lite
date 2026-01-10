import { useState } from "react";

export default function TaskList({
    tasks,
    onStatusChange,
    onDelete,
    onTitleChange,
    emptyMessage = "No tasks yet."
}) {
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState("");

    function startEdit(t) {
        setEditingId(t.id);
        setDraft(t.title);
    }

    function cancelEdit() {
        setEditingId(null);
        setDraft("");
    }

    async function saveEdit(id) {
        const v = draft.trim();
        if (!v) return; // keep simple; backend will enforce too
        await onTitleChange(id, v);
        cancelEdit();
    }

    return (
        <ul className="task-list">
            {tasks.map((t) => (
                <li key={t.id} className="task-card">
                    <div className="task-left">
                        {editingId === t.id ? (
                            <input
                                className="input"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit(t.id);
                                    if (e.key === "Escape") cancelEdit();
                                }}
                                onBlur={() => saveEdit(t.id)}
                            />
                        ) : (
                            <div
                                className="task-title"
                                title="Double-click to edit"
                                onDoubleClick={() => startEdit(t)}
                                style={{ cursor: "text" }}
                            >
                                {t.title}{" "}
                                {t._optimistic ? (
                                    <span style={{ fontSize: 12, opacity: 0.6 }}> (saving)</span>
                                ) : null}
                            </div>
                        )}

                        <div className="task-meta">
                            {t.status} • {new Date(t.created_at).toLocaleString()}
                        </div>
                    </div>

                    <div className="task-right">
                        <select
                            className="select"
                            value={t.status}
                            onChange={(e) => onStatusChange(t.id, e.target.value)}
                            disabled={editingId === t.id}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button className="btn danger" onClick={() => onDelete(t.id)} disabled={editingId === t.id}>
                            Delete
                        </button>
                    </div>
                </li>
            ))}

            {tasks.length === 0 ? <li className="empty">{emptyMessage}</li> : null}
        </ul>
    );
}
