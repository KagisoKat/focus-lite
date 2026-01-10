import { useEffect, useRef, useState } from "react";

export default function TaskForm({ onCreate, disabled, autoFocus = true }) {
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && !disabled) inputRef.current?.focus();
    }, [autoFocus, disabled]);

    async function submit(e) {
        e.preventDefault();
        const v = title.trim();
        if (!v) return;
        await onCreate(v);
        setTitle("");
        inputRef.current?.focus();
    }

    return (
        <form onSubmit={submit} className="task-form">
            <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task title..."
                className="input"
                disabled={disabled}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setTitle("");
                        inputRef.current?.blur();
                    }
                }}
            />
            <button className="btn primary" type="submit" disabled={disabled}>
                Add
            </button>
        </form>
    );
}
