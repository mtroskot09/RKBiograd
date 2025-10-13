import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageSrc: text("image_src"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fixtures = pgTable("fixtures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location").notNull(),
  status: text("status").notNull(), // 'upcoming', 'live', 'finished'
  category: text("category").notNull().default("Prva ekipa"), // 'Prva ekipa', 'U15', 'U13'
});

export const leagueTable = pgTable("league_table", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  position: integer("position").notNull(),
  team: text("team").notNull(),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  draw: integer("draw").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  goalDiff: integer("goal_diff").notNull().default(0),
  points: integer("points").notNull().default(0),
  isOurTeam: boolean("is_our_team").notNull().default(false),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertFixtureSchema = createInsertSchema(fixtures).omit({
  id: true,
});

export const insertLeagueTableSchema = createInsertSchema(leagueTable).omit({
  id: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type Fixture = typeof fixtures.$inferSelect;

export type InsertLeagueTable = z.infer<typeof insertLeagueTableSchema>;
export type LeagueTableRow = typeof leagueTable.$inferSelect;
