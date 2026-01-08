import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("Password123!");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            nav("/tasks");
        } catch (err) {
            const msg = err?.response?.data?.error || "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
            <h1>Focus Lite</h1>
            <p>Login</p>

            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
                    placeholder="you@example.com"
                />

                <label>Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
                    placeholder="Password123!"
                    type="password"
                />

                {error ? <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div> : null}

                <button disabled={loading} style={{ width: "100%", padding: 10 }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
                Note: Use a registered account. If test@example.com doesn’t exist yet, register via curl.
            </p>
        </div>
    );
}
