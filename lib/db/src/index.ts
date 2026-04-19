import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema/index.js";

export * from "./schema/index.js";
export type Schema = typeof schema;

let _db: LibSQLDatabase<Schema> | null = null;

export function getDb(): LibSQLDatabase<Schema> {
  if (_db) return _db;
  const url = process.env["TURSO_DATABASE_URL"];
  if (!url) throw new Error("TURSO_DATABASE_URL not set");
  const client = createClient({
    url,
    authToken: process.env["TURSO_AUTH_TOKEN"],
  });
  _db = drizzle(client, { schema });
  return _db;
}

export type Db = ReturnType<typeof getDb>;
