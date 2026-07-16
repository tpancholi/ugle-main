import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { databaseConfig } from "@/app/lib/env";
import * as schema from "./schema";

export function getDb() {
  if (!databaseConfig.success) {
    throw new Error("DATABASE_URL is not configured");
  }
  const sql = neon(databaseConfig.data.DATABASE_URL);
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof getDb>;
