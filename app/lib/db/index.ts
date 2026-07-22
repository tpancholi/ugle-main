import { createHash } from "crypto";
import {
  neon,
  neonConfig,
  Pool,
  type PoolClient,
} from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { databaseConfig } from "@/app/lib/env";
import * as schema from "./schema";

// Pool/Client use WebSockets; Node 22+ and Bun provide a global WebSocket.
if (typeof WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = WebSocket;
}

function requireDatabaseUrl(): string {
  if (!databaseConfig.success) {
    throw new Error("DATABASE_URL is not configured");
  }
  return databaseConfig.data.DATABASE_URL;
}

/** Stateless HTTP driver — fine for ordinary reads/writes without locks. */
export function getDb() {
  const sql = neon(requireDatabaseUrl());
  return drizzleHttp(sql, { schema });
}

export type Db = ReturnType<typeof getDb>;

/** Drizzle bound to a held Pool connection (session advisory locks). */
export type LockedDb = NeonDatabase<typeof schema>;

/** Either HTTP or locked-connection drizzle — same query surface we use. */
export type AppDb = Db | LockedDb;

/** Stable signed int32 advisory key for a customer id. */
export function customerAdvisoryKey(customerId: string): number {
  const digest = createHash("sha256")
    .update(`ugle:customer:${customerId}`)
    .digest();
  return digest.readInt32BE(0);
}

/**
 * Serialize fulfill/refund for one customer across processes.
 *
 * Non-blocking session `pg_try_advisory_lock` on a dedicated connection — works
 * while outbound Keygen HTTP runs (neon-http cannot hold a lock across
 * round-trips). If the lock is held, throws with `code: "ORDER_BUSY"` so
 * Cashfree can retry instead of blocking the serverless function through Keygen.
 * Pool is created and ended per call (Neon serverless guidance).
 */
export async function withCustomerLock<T>(
  customerId: string,
  fn: (db: LockedDb) => Promise<T>,
): Promise<T> {
  const pool = new Pool({
    connectionString: requireDatabaseUrl(),
    max: 1,
  });
  let client: PoolClient | undefined;
  let locked = false;
  const key = customerAdvisoryKey(customerId);
  try {
    client = await pool.connect();
    const lockRes = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock($1) AS locked",
      [key],
    );
    locked = Boolean(lockRes.rows[0]?.locked);
    if (!locked) {
      const err = new Error(
        `Customer ${customerId} lock busy; retry shortly`,
      );
      (err as Error & { code?: string }).code = "ORDER_BUSY";
      throw err;
    }
    const db = drizzle(client, { schema });
    return await fn(db);
  } finally {
    if (client && locked) {
      try {
        await client.query("SELECT pg_advisory_unlock($1)", [key]);
      } catch (unlockErr) {
        console.error("[withCustomerLock] unlock failed:", unlockErr);
      }
    }
    client?.release();
    await pool.end().catch((endErr) => {
      console.error("[withCustomerLock] pool.end failed:", endErr);
    });
  }
}
