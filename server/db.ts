import pg from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// Standard Postgres driver: works with Render, Neon, Replit and a local Postgres.
// Without DATABASE_URL (local development only) the app falls back to in-memory storage.
export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Hosted databases close idle connections now and then. Without this listener the
// pool's "error" event would crash the whole server; the pool reconnects on next use.
pool?.on("error", (error) => {
  console.error("Postgres connection error (will reconnect):", error.message);
});

export const db: NodePgDatabase<typeof schema> | null = pool ? drizzle(pool, { schema }) : null;
