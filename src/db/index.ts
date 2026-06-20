import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL ?? "lumen.db";

const sqlite = new Database(DATABASE_URL);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
// Wait (up to 5s) for the lock instead of throwing SQLITE_BUSY — needed when
// multiple build/runtime workers open the same file concurrently.
sqlite.pragma("busy_timeout = 5000");

export const db = drizzle(sqlite, { schema });
