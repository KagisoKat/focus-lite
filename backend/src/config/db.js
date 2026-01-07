import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: env.databaseUrl
});

export async function dbPing() {
    const result = await pool.query("SELECT 1 AS ok");
    return result.rows[0];
}
