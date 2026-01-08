import request from "supertest";
import { createApp } from "../src/app.js";

describe("health endpoints", () => {
    it("GET /health returns ok", async () => {
        const app = createApp();
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });
});
