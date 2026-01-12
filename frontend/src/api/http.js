import axios from "axios";

// In production (built), use relative URLs so nginx proxies to backend
// In dev, use direct backend URL
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

export const http = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" }
});

// Attach token automatically if present
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
