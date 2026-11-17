import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index, unique, customType } from "drizzle-orm/pg-core";
import { HRS_TEAM_KEYS } from "./hrs";
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

const bytea = customType<{ data: Buffer }>({
  dataType: () => "bytea",
});

// Uploaded images are kept in the database because Replit deployments have no persistent disk.
export const images = pgTable("images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: text("content_type").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Roles an admin can give to a coach, in the order they are shown on team pages.
export const STAFF_ROLES = ["Glavni trener", "Pomoćni trener", "Trener vratara", "Kondicijski trener"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

// Coaching staff per team, set by an admin. People are picked from the team officials listed
// on HRS match sheets (hrsPersonId); the name is copied so pages work even when HRS is down.
export const staffAssignments = pgTable(
  "staff_assignments",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    team: text("team").notNull(),
    hrsPersonId: integer("hrs_person_id").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    role: text("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique("staff_assignments_team_person").on(table.team, table.hrsPersonId)],
);

// Photo per coach (HRS person), shared by all teams the person is assigned to.
export const coachPhotos = pgTable("coach_photos", {
  hrsPersonId: integer("hrs_person_id").primaryKey(),
  photoUrl: text("photo_url").notNull(),
});

// Pages whose top image (banner / hero) an admin can change.
export const PAGE_BANNER_KEYS = ["home", "first-team", "u15", "u13", "news", "history", "contact"] as const;
export type PageBannerKey = (typeof PAGE_BANNER_KEYS)[number];

// Custom top image per page; pages without a row use their built-in default.
export const pageBanners = pgTable("page_banners", {
  page: text("page").primaryKey(),
  imageSrc: text("image_src").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Club contact details shown in the footer and on the contact page (a single row, id "main").
export const clubInfo = pgTable("club_info", {
  id: varchar("id").primaryKey().default("main"),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  address: text("address").notNull().default(""),
  officeHours: text("office_hours").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// History page (edited in Admin → History). Texts and stat boxes live in a single row (id "main").
export interface HistoryStat {
  value: string; // e.g. "1963"
  label: string; // e.g. "Godina osnutka"
}

export const historyContent = pgTable("history_content", {
  id: varchar("id").primaryKey().default("main"),
  intro: text("intro").notNull().default(""),
  mission: text("mission").notNull().default(""),
  stats: jsonb("stats").$type<HistoryStat[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Timeline entries; shown newest first (sortYear, then year text).
export const historyEvents = pgTable("history_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: text("year").notNull(), // free text: "1963", "2010./11.", "2011. – 2019."
  sortYear: integer("sort_year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  imageSrc: text("image_src"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Photo gallery at the bottom of the history page.
export const historyPhotos = pgTable("history_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageSrc: text("image_src").notNull(),
  caption: text("caption").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Index 0 = dayOfWeek 1 (Monday) … index 6 = dayOfWeek 7 (Sunday).
export const TRAINING_DAYS = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"] as const;

// Weekly training schedule per team, set by an admin.
export const trainingSessions = pgTable("training_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  team: text("team").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Fixtures and league standings are not stored: they come live from HRS (see shared/hrs.ts).

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// publishedAt arrives as an ISO string in JSON requests, so it is coerced to a Date.
export const insertPostSchema = createInsertSchema(posts, {
  publishedAt: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export const insertStaffAssignmentSchema = z.object({
  team: z.enum(HRS_TEAM_KEYS),
  hrsPersonId: z.number().int().positive(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: z.enum(STAFF_ROLES),
});

// Only team and role can change; the person stays the same.
export const updateStaffAssignmentSchema = insertStaffAssignmentSchema.pick({ team: true, role: true }).partial();

export type InsertStaffAssignment = z.infer<typeof insertStaffAssignmentSchema>;
export type StaffAssignment = typeof staffAssignments.$inferSelect;

const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Upišite vrijeme u obliku HH:MM");

const trainingSessionFields = z.object({
  team: z.enum(HRS_TEAM_KEYS),
  dayOfWeek: z.number().int().min(1).max(7),
  startTime: timeOfDay,
  endTime: timeOfDay,
  location: z.string().trim().max(100).nullish().transform((v) => v || null),
});

const endsAfterStart = (s: { startTime: string; endTime: string }) => s.endTime > s.startTime;

export const insertTrainingSessionSchema = trainingSessionFields.refine(endsAfterStart, {
  message: "Kraj mora biti nakon početka",
  path: ["endTime"],
});

// Partial update; the server re-checks start/end against the stored session.
export const updateTrainingSessionSchema = trainingSessionFields.partial();

export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;

// Only images uploaded through /api/images can be used as coach photos.
export const coachPhotoSchema = z.object({
  photoUrl: z.string().regex(/^\/api\/images\/[0-9a-f-]+$/, "Najprije učitajte fotografiju").nullable(),
});

export type StaffMember = StaffAssignment & { photoUrl: string | null };

export const clubInfoSchema = z.object({
  phone: z.string().trim().max(50),
  email: z.union([z.literal(""), z.string().trim().email().max(100)]),
  address: z.string().trim().max(200),
  // One line per row, e.g. "Ponedjeljak - Petak: 16:00 - 21:00"
  officeHours: z.string().trim().max(500),
});

export type ClubInfo = z.infer<typeof clubInfoSchema>;

// Shown until an admin saves real details (the values the site had before they were editable).
export const DEFAULT_CLUB_INFO: ClubInfo = {
  phone: "+385 23 123 456",
  email: "info@rkbiograd.hr",
  address: "Sportska dvorana Biograd\nBiograd na Moru, 23210\nHrvatska",
  officeHours: "Ponedjeljak - Petak: 16:00 - 21:00\nSubota: 09:00 - 14:00\nNedjelja: Zatvoreno",
};

// Uploaded images only (see /api/images).
const uploadedImageUrl = z.string().regex(/^\/api\/images\/[0-9a-f-]+$/, "Najprije učitajte fotografiju");

// null = back to the page's built-in default image
export const pageBannerSchema = z.object({
  imageSrc: uploadedImageUrl.nullable(),
});

export const historyContentSchema = z.object({
  intro: z.string().trim().max(2000),
  mission: z.string().trim().max(4000),
  stats: z
    .array(z.object({ value: z.string().trim().min(1).max(20), label: z.string().trim().min(1).max(60) }))
    .max(4),
});

export const insertHistoryEventSchema = z.object({
  year: z.string().trim().min(1).max(30),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000),
  imageSrc: uploadedImageUrl.nullable(),
});

export const insertHistoryPhotoSchema = z.object({
  imageSrc: uploadedImageUrl,
  caption: z.string().trim().max(200),
});

export type HistoryContent = z.infer<typeof historyContentSchema>;
export type InsertHistoryEvent = z.infer<typeof insertHistoryEventSchema>;
export type HistoryEvent = typeof historyEvents.$inferSelect;
export type InsertHistoryPhoto = z.infer<typeof insertHistoryPhotoSchema>;
export type HistoryPhoto = typeof historyPhotos.$inferSelect;

export interface HistoryPage {
  content: HistoryContent;
  events: HistoryEvent[];
  photos: HistoryPhoto[];
}

/** First year found in a free-text year ("2010./11." → 2010), used to order the timeline. */
export const sortYearOf = (year: string) => Number(year.match(/\d{4}/)?.[0] ?? 0);

export type InsertImage = typeof images.$inferInsert;
export type Image = typeof images.$inferSelect;
