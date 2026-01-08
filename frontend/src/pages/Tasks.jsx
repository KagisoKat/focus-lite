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

    async function load() {
        setLoading(true);
        try {
            const data = await listTasks(50);
            setTasks(data.tasks || []);
        } catch (err) {
            const code = err?.response?.status;
            if (code === 401) {
                logout();
                nav("/login");
                return;
            }
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        if (statusFilter === "all") return tasks;
        return tasks.filter((t) => t.status === statusFilter);
    }, [tasks, statusFilter]);

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
                <TaskList tasks={filtered} onStatusChange={onStatusChange} onDelete={onDelete} />
            ) : null}

            <ToastContainer toasts={toast.toasts} onClose={toast.remove} />
        </div>
    );
}
