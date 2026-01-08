import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login } from "../api/auth";

export default function Register() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setDetails(null);
        setLoading(true);

        try {
            await register(email, password);
            const data = await login(email, password); // auto-login after register
            localStorage.setItem("token", data.token);
            nav("/tasks");
        } catch (err) {
            const data = err?.response?.data;
            setError(data?.error || "Registration failed");
            setDetails(data?.details || null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "system-ui" }}>
            <h1>Focus Lite</h1>
            <p>Create account</p>

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

                {details ? (
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>
                        {details.email ? <div>Email: {details.email}</div> : null}
                        {details.password ? <div>Password: {details.password}</div> : null}
                    </div>
                ) : null}

                <button disabled={loading} style={{ width: "100%", padding: 10 }}>
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <p style={{ marginTop: 12, fontSize: 14 }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
