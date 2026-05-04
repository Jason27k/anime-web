import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const _sql = neon(process.env.DATABASE_URL!);
const _db = drizzle(_sql, { schema });

// authToken param is wired through but not yet active — Neon JWKS configuration
// for pg_session_jwt is not currently accessible via their console UI.
// RLS policies are in place; swap in the line below when JWKS is configurable:
//   return drizzle(neon(process.env.DATABASE_URL!, { authToken }), { schema });
export function getDb(_authToken: string) {
  return _db;
}

export const db = _db;
