import request from "supertest";
import { createApp } from "../src/app.js";

function uniqueEmail() {
    return `neg_${Date.now()}@example.com`;
}

async function registerAndLogin(app) {
    const email = uniqueEmail();
    const password = "Password123!";

    await request(app).post("/api/auth/register").send({ email, password });
    const r = await request(app).post("/api/auth/login").send({ email, password });
    return { token: r.body.token, email, password };
}

describe("negative cases", () => {
    it("401: tasks endpoints reject missing token", async () => {
        const app = createApp();
        const r = await request(app).get("/api/tasks");
        expect(r.status).toBe(401);
    });

    it("422: register rejects weak password", async () => {
        const app = createApp();
        const r = await request(app)
            .post("/api/auth/register")
            .send({ email: uniqueEmail(), password: "short" });

        expect(r.status).toBe(422);
        expect(r.body.ok).toBe(false);
    });

    it("409: register rejects duplicate email", async () => {
        const app = createApp();
        const email = uniqueEmail();
        const password = "Password123!";

        const r1 = await request(app).post("/api/auth/register").send({ email, password });
        expect(r1.status).toBe(201);

        const r2 = await request(app).post("/api/auth/register").send({ email, password });
        expect(r2.status).toBe(409);
    });

    it("422: tasks create rejects empty title", async () => {
        const app = createApp();
        const { token } = await registerAndLogin(app);

        const r = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "   " });

        expect(r.status).toBe(422);
    });

    it("422: tasks update rejects invalid status", async () => {
        const app = createApp();
        const { token } = await registerAndLogin(app);

        // create a task first
        const c = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "x" });

        const id = c.body.task.id;

        const r = await request(app)
            .patch(`/api/tasks/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "done" });

        expect(r.status).toBe(422);
    });

    it("404: update/delete task not found", async () => {
        const app = createApp();
        const { token } = await registerAndLogin(app);

        const missingId = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";

        const u = await request(app)
            .patch(`/api/tasks/${missingId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "completed" });

        expect(u.status).toBe(404);

        const d = await request(app)
            .delete(`/api/tasks/${missingId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(d.status).toBe(404);
    });
});
