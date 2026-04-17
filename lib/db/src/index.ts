import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Allow API startup without a configured DB in local/dev environments.
// Queries will fail fast and route-level fallbacks can still serve core features.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 1000,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
