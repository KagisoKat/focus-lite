import request from "supertest";
import { createApp } from "../src/app.js";

function uniqueEmail() {
    return `test_${Date.now()}@example.com`;
}

describe("auth", () => {
    it("register then login returns token", async () => {
        const app = createApp();
        const email = uniqueEmail();
        const password = "Password123!";

        const r1 = await request(app)
            .post("/api/auth/register")
            .send({ email, password });

        expect(r1.status).toBe(201);
        expect(r1.body.ok).toBe(true);

        const r2 = await request(app)
            .post("/api/auth/login")
            .send({ email, password });

        expect(r2.status).toBe(200);
        expect(r2.body.ok).toBe(true);
        expect(typeof r2.body.token).toBe("string");
        expect(r2.body.token.length).toBeGreaterThan(20);
    });
});
