import request from "supertest";
import { createApp } from "../src/app.js";

function uniqueEmail() {
    return `task_test_${Date.now()}@example.com`;
}

describe("tasks (happy path)", () => {
    it("register → login → create task → list tasks includes it", async () => {
        const app = createApp();

        const email = uniqueEmail();
        const password = "Password123!";
        const title = "Happy path task";

        // 1) Register
        const r1 = await request(app)
            .post("/api/auth/register")
            .send({ email, password });

        expect(r1.status).toBe(201);
        expect(r1.body.ok).toBe(true);

        // 2) Login
        const r2 = await request(app)
            .post("/api/auth/login")
            .send({ email, password });

        expect(r2.status).toBe(200);
        expect(r2.body.ok).toBe(true);
        expect(typeof r2.body.token).toBe("string");

        const token = r2.body.token;

        // 3) Create task
        const r3 = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title });

        expect(r3.status).toBe(201);
        expect(r3.body.ok).toBe(true);
        expect(r3.body.task.title).toBe(title);
        expect(["pending", "in_progress", "completed"]).toContain(r3.body.task.status);

        // 4) List tasks (limit high enough)
        const r4 = await request(app)
            .get("/api/tasks?limit=50")
            .set("Authorization", `Bearer ${token}`);

        expect(r4.status).toBe(200);
        expect(r4.body.ok).toBe(true);
        expect(Array.isArray(r4.body.tasks)).toBe(true);

        const titles = r4.body.tasks.map((t) => t.title);
        expect(titles).toContain(title);
    });
});
