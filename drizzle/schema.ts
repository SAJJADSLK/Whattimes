import { decimal, integer, json, pgEnum, pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"])("role").default("user").notNull(),
  theme: pgEnum("theme", ["light", "dark", "auto"])("theme").default("auto").notNull(),
  defaultTimezone: varchar("defaultTimezone", { length: 64 }).default("UTC").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().default(sql`CURRENT_TIMESTAMP`).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cities table with timezone and geographic information
 */
export const cities = pgTable("cities", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  country: varchar("country", { length: 128 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  utcOffsetMinutes: integer("utcOffsetMinutes").notNull(),
  region: varchar("region", { length: 64 }).notNull(), // continent
  searchKeywords: text("searchKeywords"),
  population: integer("population"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

/**
 * User favorite cities for quick access
 */
export const userFavoriteCities = pgTable("userFavoriteCities", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  userId: integer("userId").notNull(),
  cityId: integer("cityId").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavoriteCity = typeof userFavoriteCities.$inferSelect;
export type InsertUserFavoriteCity = typeof userFavoriteCities.$inferInsert;

/**
 * Team dashboards for tracking multiple timezones
 */
export const teamDashboards = pgTable("teamDashboards", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  cityIds: json("cityIds").$type<number[]>().notNull(), // array of city IDs
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TeamDashboard = typeof teamDashboards.$inferSelect;
export type InsertTeamDashboard = typeof teamDashboards.$inferInsert;

/**
 * Meeting invites with shareable links
 */
export const meetingInvites = pgTable("meetingInvites", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  userId: integer("userId").notNull(),
  inviteCode: varchar("inviteCode", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  cityIds: json("cityIds").$type<number[]>().notNull(),
  meetingTimeUtc: timestamp("meetingTimeUtc").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type MeetingInvite = typeof meetingInvites.$inferSelect;
export type InsertMeetingInvite = typeof meetingInvites.$inferInsert;

/**
 * Countdown timers with shareable links
 */
export const countdownTimers = pgTable("countdownTimers", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  userId: integer("userId"),
  countdownCode: varchar("countdownCode", { length: 32 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  targetTimeUtc: timestamp("targetTimeUtc").notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type CountdownTimer = typeof countdownTimers.$inferSelect;
export type InsertCountdownTimer = typeof countdownTimers.$inferInsert;