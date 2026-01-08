export default function TaskList({
    tasks,
    onStatusChange,
    onDelete
}) {
    return (
        <ul className="task-list">
            {tasks.map((t) => (
                <li key={t.id} className="task-card">
                    <div className="task-left">
                        <div className="task-title">{t.title}</div>
                        <div className="task-meta">
                            {t.status} • {new Date(t.created_at).toLocaleString()}
                        </div>
                    </div>

                    <div className="task-right">
                        <select
                            className="select"
                            value={t.status}
                            onChange={(e) => onStatusChange(t.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button className="btn danger" onClick={() => onDelete(t.id)}>
                            Delete
                        </button>
                    </div>
                </li>
            ))}

            {tasks.length === 0 ? <li className="empty">No tasks yet.</li> : null}
        </ul>
    );
}
