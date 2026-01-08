import { useState } from "react";

export default function TaskForm({ onCreate, disabled }) {
    const [title, setTitle] = useState("");

    async function submit(e) {
        e.preventDefault();
        const v = title.trim();
        if (!v) return;
        await onCreate(v);
        setTitle("");
    }

    return (
        <form onSubmit={submit} className="task-form">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task title..."
                className="input"
                disabled={disabled}
            />
            <button className="btn" type="submit" disabled={disabled}>
                Add
            </button>
        </form>
    );
}
