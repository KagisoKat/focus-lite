import { useCallback, useState } from "react";

let counter = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((type, message, timeout = 3000) => {
        const id = ++counter;
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => remove(id), timeout);
    }, [remove]);

    return {
        toasts,
        success: (msg, t) => push("success", msg, t),
        error: (msg, t) => push("error", msg, t),
        info: (msg, t) => push("info", msg, t),
        remove
    };
}
