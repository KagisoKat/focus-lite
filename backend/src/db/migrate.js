import fs from "fs";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mustEnv(name) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing ${name}`);
    return v;
}

async function main() {
    const databaseUrl = mustEnv("DATABASE_URL");

    const client = new Client({ connectionString: databaseUrl });
    await client.connect();

    // migrations directory: backend/src/db/migrations
    const migrationsDir = path.resolve(__dirname, "migrations");
    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort(); // relies on 001_, 002_ naming

    await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

    for (const file of files) {
        const already = await client.query(
            "SELECT 1 FROM schema_migrations WHERE filename = $1",
            [file]
        );
        if (already.rowCount > 0) continue;

        const full = path.join(migrationsDir, file);
        const sql = fs.readFileSync(full, "utf8").trim();
        if (!sql) continue;

        console.log(`Applying migration: ${file}`);
        await client.query("BEGIN");
        try {
            await client.query(sql);
            await client.query(
                "INSERT INTO schema_migrations(filename) VALUES ($1)",
                [file]
            );
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(`Migration failed: ${file}`);
            throw err;
        }
    }

    console.log("Migrations complete");
    await client.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
