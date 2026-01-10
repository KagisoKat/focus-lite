import { useEffect, useMemo, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { getTheme, toggleTheme, applyTheme } from "../utils/theme";

import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";
import TaskListSkeleton from "../components/TaskListSkeleton";
import ToastContainer from "../components/ToastContainer";

import "../styles/app.css";

function tempId() {
    // Use crypto.randomUUID() for secure random IDs (satisfies S2245)
    return `temp_${crypto.randomUUID()}`;
}

export default function Tasks() {
    const nav = useNavigate();
    const toast = useToast();

    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(getTheme());
    const [cursorAt, setCursorAt] = useState(null);
    const [cursorId, setCursorId] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);

    async function load() {
        setError("");
        setLoading(true);

        try {
            const data = await listTasks({ limit: 20 });
            setTasks(data.tasks || []);

            setCursorAt(data.page?.next_cursor_at || null);
            setCursorId(data.page?.next_cursor_id || null);

            setHasMore(Boolean(data.page?.next_cursor_at && data.page?.next_cursor_id) && (data.tasks?.length || 0) > 0);
        } catch (err) {
            const code = err?.response?.status;
            if (code === 401) {
                logout();
                nav("/login");
                return;
            }
            setError(err?.response?.data?.error || "Failed to load tasks");
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function groupByStatus(items) {
        return {
            pending: items.filter((t) => t.status === "pending"),
            in_progress: items.filter((t) => t.status === "in_progress"),
            completed: items.filter((t) => t.status === "completed")
        };
    }

    const view = useMemo(() => {
        if (statusFilter === "all") return groupByStatus(tasks);
        return {
            pending: statusFilter === "pending" ? tasks.filter((t) => t.status === "pending") : [],
            in_progress: statusFilter === "in_progress" ? tasks.filter((t) => t.status === "in_progress") : [],
            completed: statusFilter === "completed" ? tasks.filter((t) => t.status === "completed") : []
        };
    }, [tasks, statusFilter]);

    const counts = useMemo(() => ({
        pending: view.pending.length,
        in_progress: view.in_progress.length,
        completed: view.completed.length
    }), [view]);

    async function onCreate(title) {
        const optimisticTask = {
            id: tempId(),
            title,
            status: "pending",
            created_at: new Date().toISOString(),
            _optimistic: true
        };

        // UI first
        setTasks((prev) => [optimisticTask, ...prev]);
        toast.info("Adding task...");

        try {
            const data = await createTask(title);

            // Replace temp task with real one from server
            setTasks((prev) =>
                prev.map((t) => (t.id === optimisticTask.id ? data.task : t))
            );

            toast.success("Task added");
        } catch (err) {
            // Rollback
            setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
            toast.error(err?.response?.data?.error || "Failed to add task");
        }
    }

    async function onStatusChange(id, status) {
        const prevTask = tasks.find((t) => t.id === id);
        if (!prevTask) return;

        // UI first
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        toast.info("Updating...");

        try {
            const data = await updateTask(id, { status });
            // Confirm with server response
            setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
            toast.success("Task updated");
        } catch (err) {
            // Rollback
            setTasks((prev) => prev.map((t) => (t.id === id ? prevTask : t)));
            toast.error(err?.response?.data?.error || "Failed to update task");
        }
    }

    async function onTitleChange(id, title) {
        setError("");

        const prevTask = tasks.find((t) => t.id === id);
        if (!prevTask) return;

        // UI first
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
        toast.info("Updating title...");

        try {
            const data = await updateTask(id, { title });
            setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
            toast.success("Title updated");
        } catch (err) {
            setTasks((prev) => prev.map((t) => (t.id === id ? prevTask : t)));
            toast.error(err?.response?.data?.error || "Failed to update title");
        }
    }

    async function onDelete(id) {
        const prevTasks = tasks;

        // UI first
        setTasks((prev) => prev.filter((t) => t.id !== id));
        toast.info("Deleting...");

        try {
            await deleteTask(id);
            toast.success("Task deleted");
        } catch (err) {
            // Rollback
            setTasks(prevTasks);
            toast.error(err?.response?.data?.error || "Failed to delete task");
        }
    }

    async function loadMore() {
        if (!hasMore || loadingMore || !cursorAt || !cursorId) return;

        setLoadingMore(true);
        try {
            const data = await listTasks({ limit: 20, cursorAt, cursorId });
            const newTasks = data.tasks || [];

            setTasks((prev) => [...prev, ...newTasks]);

            setCursorAt(data.page?.next_cursor_at || null);
            setCursorId(data.page?.next_cursor_id || null);

            setHasMore(Boolean(data.page?.next_cursor_at && data.page?.next_cursor_id) && newTasks.length > 0);
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to load more");
        } finally {
            setLoadingMore(false);
        }
    }

    function onLogout() {
        logout();
        nav("/login");
    }

    return (
        <div className={`container ${loading ? "loading" : ""}`}>
            <div className="topbar">
                <h1>Tasks</h1>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        className="btn"
                        onClick={() => {
                            const next = toggleTheme();
                            applyTheme(next);
                            setTheme(next);
                        }}
                    >
                        {theme === "dark" ? "Light mode" : "Dark mode"}
                    </button>
                    <button className="btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <TaskFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={load}
                loading={loading}
            />

            <TaskForm onCreate={onCreate} disabled={loading} />

            {loading ? <TaskListSkeleton count={6} /> : null}

            {!loading ? (
                <>
                    <h2 style={{ marginTop: 12 }}>Pending ({counts.pending})</h2>
                    <TaskList
                        tasks={view.pending}
                        onStatusChange={onStatusChange}
                        onTitleChange={onTitleChange}
                        onDelete={onDelete}
                        emptyMessage="No pending tasks."
                    />

                    <h2 style={{ marginTop: 18 }}>In Progress ({counts.in_progress})</h2>
                    <TaskList
                        tasks={view.in_progress}
                        onStatusChange={onStatusChange}
                        onTitleChange={onTitleChange}
                        onDelete={onDelete}
                        emptyMessage="No tasks in progress."
                    />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
                        <h2 style={{ margin: 0 }}>Completed ({counts.completed})</h2>
                        <button className="btn ghost" onClick={() => setShowCompleted((v) => !v)}>
                            {showCompleted ? "Hide" : "Show"}
                        </button>
                    </div>

                    {showCompleted ? (
                        <TaskList
                            tasks={view.completed}
                            onStatusChange={onStatusChange}
                            onTitleChange={onTitleChange}
                            onDelete={onDelete}
                            emptyMessage="No completed tasks."
                        />
                    ) : null}

                    <div style={{ marginTop: 12 }}>
                        <button className="btn" onClick={loadMore} disabled={!hasMore || loadingMore || loading}>
                            {loadingMore ? "Loading..." : hasMore ? "Load more" : "No more tasks"}
                        </button>
                    </div>
                </>
            ) : null}

            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
        </div>
    );
}
