import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./users.js";

export const routesTable = sqliteTable("routes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  shapeId: text("shape_id").notNull(),
  title: text("title").notNull().default(""),
  centerLat: real("center_lat").notNull(),
  centerLng: real("center_lng").notNull(),
  diameterMeters: real("diameter_meters").notNull(),
  polylineJson: text("polyline_json").notNull(),
  turnsJson: text("turns_json").notNull(),
  gpxContent: text("gpx_content"),
  totalDistanceMeters: real("total_distance_meters"),
  fidelityScore: real("fidelity_score"),
  stravaActivityId: text("strava_activity_id"),
  shareToken: text("share_token").unique(),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});
