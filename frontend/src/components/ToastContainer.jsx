export default function ToastContainer({ toasts, onClose }) {
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span>{t.message}</span>
                    <button onClick={() => onClose(t.id)}>×</button>
                </div>
            ))}
        </div>
    );
}
