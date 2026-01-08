import { http } from "./http";

export async function register(email, password) {
    const { data } = await http.post("/api/auth/register", { email, password });
    return data;
}

export async function login(email, password) {
    const { data } = await http.post("/api/auth/login", { email, password });
    return data;
}

export function logout() {
    localStorage.removeItem("token");
}
