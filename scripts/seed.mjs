// Seed script. Run with Node (not Bun): `bun run db:seed` -> `node scripts/seed.mjs`.
// Note: better-sqlite3 is a native addon that does NOT load under the Bun runtime
// (oven-sh/bun#4290), so this script is executed by Node. The Next.js app uses
// better-sqlite3 too, but Next runs server code on Node, so that path is fine.
import Database from "better-sqlite3";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const seedUrl = new URL("../src/lib/data/leads.seed.json", import.meta.url);
const rows = JSON.parse(await readFile(fileURLToPath(seedUrl), "utf8"));

const db = new Database(process.env.DATABASE_URL ?? "lumen.db");

const { c } = db.prepare("SELECT count(*) AS c FROM leads").get();
if (c > 0) {
  console.log("Leads already seeded — skipping.");
  process.exit(0);
}

// Drizzle's `integer({ mode: "timestamp" })` stores Unix seconds.
const now = Math.floor(Date.now() / 1000);
const insert = db.prepare(
  `INSERT INTO leads (
     id, company, contact_name, contact_email, status, priority, owner, notes, created_at, updated_at
   ) VALUES (
     @id, @company, @contactName, @contactEmail, @status, @priority, @owner, @notes, @created_at, @updated_at
   )`,
);
const insertLog = db.prepare(
  `INSERT INTO audit_logs (id, action, resource, resource_id, summary, created_at)
   VALUES (@id, @action, @resource, @resourceId, @summary, @created_at)`,
);
const insertMany = db.transaction((all) => {
  for (const r of all) insert.run({ ...r, created_at: now, updated_at: now });
  insertLog.run({
    id: "LOG-SEED-001",
    action: "create",
    resource: "lead",
    resourceId: "LEAD-001",
    summary: "Created lead for Northstar SaaS",
    created_at: now,
  });
  insertLog.run({
    id: "LOG-SEED-002",
    action: "update",
    resource: "lead",
    resourceId: "LEAD-002",
    summary: "Qualified lead for Bright Ops",
    created_at: now,
  });
});
insertMany(rows);

console.log(`Seeded ${rows.length} leads.`);
