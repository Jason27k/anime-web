import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const _sql = neon(process.env.DATABASE_URL!);
const _db = drizzle(_sql, { schema });

export function getDb(_authToken: string) {
  return _db;
}

export const db = _db;
