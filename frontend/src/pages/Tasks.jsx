import { useEffect, useMemo, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";

import "../styles/app.css";

export default function Tasks() {
    const nav = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function load() {
        setError("");
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
            setError(err?.response?.data?.error || "Failed to load tasks");
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
        setError("");
        try {
            const data = await createTask(title);
            setTasks((prev) => [data.task, ...prev]);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to create task");
        }
    }

    async function onStatusChange(id, status) {
        setError("");
        try {
            const data = await updateTask(id, { status });
            setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to update task");
        }
    }

    async function onDelete(id) {
        setError("");
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to delete task");
        }
    }

    function onLogout() {
        logout();
        nav("/login");
    }

    return (
        <div className="container">
            <div className="topbar">
                <h1>Tasks</h1>
                <button className="btn" onClick={onLogout}>
                    Logout
                </button>
            </div>

            <TaskFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onRefresh={load}
                loading={loading}
            />

            <TaskForm onCreate={onCreate} disabled={loading} />

            {error ? <div className="error">{error}</div> : null}

            {loading ? <div>Loading...</div> : null}

            {!loading ? (
                <TaskList tasks={filtered} onStatusChange={onStatusChange} onDelete={onDelete} />
            ) : null}
        </div>
    );
}
