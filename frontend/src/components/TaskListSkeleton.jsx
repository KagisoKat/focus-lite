export default function TaskListSkeleton({ count = 5 }) {
    return (
        <ul className="task-list">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i} className="task-card skeleton" style={{ padding: 12 }}>
                    <div style={{ flex: 1 }}>
                        <div className="skeleton-row large" />
                        <div style={{ height: 8 }} />
                        <div className="skeleton-row small" />
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div className="skeleton" style={{ width: 140, height: 38, borderRadius: 10 }} />
                        <div className="skeleton" style={{ width: 80, height: 38, borderRadius: 10 }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
