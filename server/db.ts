import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";

type PostgresClient = ReturnType<typeof postgres>;
type DbClient = ReturnType<typeof drizzle>;

let _sql: PostgresClient | null = null;
let _db: DbClient | null = null;

// Lazily create the Drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const databaseUrl = ENV.databaseUrl || process.env.DATABASE_URL;

  if (!_db && databaseUrl) {
    try {
      _sql = postgres(databaseUrl, {
        // Vercel functions should keep pools small; Neon pooling handles fan-out.
        max: Number(process.env.POSTGRES_MAX_CONNECTIONS ?? "1"),
        idle_timeout: 20,
        connect_timeout: 15,
        // Required/recommended when using Neon pooled PgBouncer connections.
        prepare: false,
        ssl: "require",
      });
      _db = drizzle(_sql);
    } catch (error) {
      console.warn("[Database] Failed to initialize:", error);
      _sql = null;
      _db = null;
    }
  }

  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function closeDb() {
  if (_sql) {
    await _sql.end({ timeout: 5 });
  }
  _sql = null;
  _db = null;
}

// TODO: add feature queries here as your schema grows.
