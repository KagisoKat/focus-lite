export default function TaskFilters({
    statusFilter,
    setStatusFilter,
    onRefresh,
    loading
}) {
    return (
        <div className="filters">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select"
                disabled={loading}
            >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <button className="btn" onClick={onRefresh} disabled={loading}>
                Refresh
            </button>
        </div>
    );
}
