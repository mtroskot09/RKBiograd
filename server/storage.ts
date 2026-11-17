import {
  images,
  posts,
  staffAssignments,
  trainingSessions,
  coachPhotos,
  clubInfo,
  historyContent,
  historyEvents,
  historyPhotos,
  pageBanners,
  users,
  type Image,
  type InsertImage,
  type InsertPost,
  type InsertStaffAssignment,
  type Post,
  type StaffAssignment,
  type InsertTrainingSession,
  type TrainingSession,
  type ClubInfo,
  type HistoryContent,
  type HistoryEvent,
  type HistoryPhoto,
  type InsertHistoryEvent,
  type InsertHistoryPhoto,
  sortYearOf,
  type UpsertUser,
  type User,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";

type Database = NonNullable<typeof db>;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;

  getImage(id: string): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  deleteImage(id: string): Promise<boolean>;

  getStaffAssignments(): Promise<StaffAssignment[]>;
  createStaffAssignment(assignment: InsertStaffAssignment): Promise<StaffAssignment>;
  updateStaffAssignment(
    id: string,
    update: Partial<Pick<InsertStaffAssignment, "team" | "role">>,
  ): Promise<StaffAssignment | undefined>;
  deleteStaffAssignment(id: string): Promise<boolean>;

  getTrainingSessions(): Promise<TrainingSession[]>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  updateTrainingSession(id: string, update: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined>;
  deleteTrainingSession(id: string): Promise<boolean>;

  getCoachPhotos(): Promise<Map<number, string>>;
  /** Sets or (with null) removes a coach's photo; returns the previous photo URL. */
  setCoachPhoto(hrsPersonId: number, photoUrl: string | null): Promise<string | null>;

  getClubInfo(): Promise<ClubInfo | undefined>;
  saveClubInfo(info: ClubInfo): Promise<ClubInfo>;

  getHistoryContent(): Promise<HistoryContent | undefined>;
  saveHistoryContent(content: HistoryContent): Promise<HistoryContent>;
  getHistoryEvents(): Promise<HistoryEvent[]>;
  createHistoryEvent(event: InsertHistoryEvent): Promise<HistoryEvent>;
  updateHistoryEvent(id: string, event: InsertHistoryEvent): Promise<HistoryEvent | undefined>;
  deleteHistoryEvent(id: string): Promise<HistoryEvent | undefined>;
  getHistoryPhotos(): Promise<HistoryPhoto[]>;
  createHistoryPhoto(photo: InsertHistoryPhoto): Promise<HistoryPhoto>;
  updateHistoryPhotoCaption(id: string, caption: string): Promise<HistoryPhoto | undefined>;
  deleteHistoryPhoto(id: string): Promise<HistoryPhoto | undefined>;

  getPageBanners(): Promise<Record<string, string>>;
  /** Sets or (with null) removes a page's custom top image; returns the previous image URL. */
  setPageBanner(page: string, imageSrc: string | null): Promise<string | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private images: Map<string, Image>;
  private staff: Map<string, StaffAssignment>;
  private trainings: Map<string, TrainingSession>;
  private coachPhotos = new Map<number, string>();
  private clubInfo: ClubInfo | undefined;
  private historyContent: HistoryContent | undefined;
  private historyEvents = new Map<string, HistoryEvent>();
  private historyPhotos = new Map<string, HistoryPhoto>();
  private pageBanners = new Map<string, string>();

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.images = new Map();
    this.staff = new Map();
    this.trainings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const existingUser = this.users.get(id);
    const user: User = {
      id,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = {
      ...insertPost,
      id,
      imageSrc: insertPost.imageSrc ?? null,
      createdAt: new Date(),
      publishedAt: insertPost.publishedAt || new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    const existing = this.posts.get(id);
    if (!existing) return undefined;
    
    const updated: Post = { ...existing, ...postUpdate };
    this.posts.set(id, updated);
    return updated;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getImage(id: string): Promise<Image | undefined> {
    return this.images.get(id);
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const image: Image = { id: randomUUID(), createdAt: new Date(), ...insertImage } as Image;
    this.images.set(image.id, image);
    return image;
  }

  async deleteImage(id: string): Promise<boolean> {
    return this.images.delete(id);
  }

  async getStaffAssignments(): Promise<StaffAssignment[]> {
    return Array.from(this.staff.values());
  }

  async createStaffAssignment(assignment: InsertStaffAssignment): Promise<StaffAssignment> {
    const row: StaffAssignment = { ...assignment, id: randomUUID(), createdAt: new Date() };
    this.staff.set(row.id, row);
    return row;
  }

  async updateStaffAssignment(
    id: string,
    update: Partial<Pick<InsertStaffAssignment, "team" | "role">>,
  ): Promise<StaffAssignment | undefined> {
    const existing = this.staff.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...update };
    this.staff.set(id, updated);
    return updated;
  }

  async deleteStaffAssignment(id: string): Promise<boolean> {
    return this.staff.delete(id);
  }

  async getTrainingSessions(): Promise<TrainingSession[]> {
    return Array.from(this.trainings.values());
  }

  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const row: TrainingSession = { ...session, id: randomUUID(), createdAt: new Date() };
    this.trainings.set(row.id, row);
    return row;
  }

  async updateTrainingSession(id: string, update: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined> {
    const existing = this.trainings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...update };
    this.trainings.set(id, updated);
    return updated;
  }

  async deleteTrainingSession(id: string): Promise<boolean> {
    return this.trainings.delete(id);
  }

  async getCoachPhotos(): Promise<Map<number, string>> {
    return new Map(this.coachPhotos);
  }

  async setCoachPhoto(hrsPersonId: number, photoUrl: string | null): Promise<string | null> {
    const previous = this.coachPhotos.get(hrsPersonId) ?? null;
    if (photoUrl) this.coachPhotos.set(hrsPersonId, photoUrl);
    else this.coachPhotos.delete(hrsPersonId);
    return previous;
  }

  async getClubInfo(): Promise<ClubInfo | undefined> {
    return this.clubInfo;
  }

  async saveClubInfo(info: ClubInfo): Promise<ClubInfo> {
    this.clubInfo = { ...info };
    return this.clubInfo;
  }

  async getHistoryContent(): Promise<HistoryContent | undefined> {
    return this.historyContent;
  }

  async saveHistoryContent(content: HistoryContent): Promise<HistoryContent> {
    this.historyContent = { ...content };
    return this.historyContent;
  }

  async getHistoryEvents(): Promise<HistoryEvent[]> {
    return Array.from(this.historyEvents.values());
  }

  async createHistoryEvent(event: InsertHistoryEvent): Promise<HistoryEvent> {
    const row: HistoryEvent = { ...event, id: randomUUID(), sortYear: sortYearOf(event.year), createdAt: new Date() };
    this.historyEvents.set(row.id, row);
    return row;
  }

  async updateHistoryEvent(id: string, event: InsertHistoryEvent): Promise<HistoryEvent | undefined> {
    const existing = this.historyEvents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event, sortYear: sortYearOf(event.year) };
    this.historyEvents.set(id, updated);
    return updated;
  }

  async deleteHistoryEvent(id: string): Promise<HistoryEvent | undefined> {
    const existing = this.historyEvents.get(id);
    this.historyEvents.delete(id);
    return existing;
  }

  async getHistoryPhotos(): Promise<HistoryPhoto[]> {
    return Array.from(this.historyPhotos.values());
  }

  async createHistoryPhoto(photo: InsertHistoryPhoto): Promise<HistoryPhoto> {
    const row: HistoryPhoto = { ...photo, id: randomUUID(), createdAt: new Date() };
    this.historyPhotos.set(row.id, row);
    return row;
  }

  async updateHistoryPhotoCaption(id: string, caption: string): Promise<HistoryPhoto | undefined> {
    const existing = this.historyPhotos.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, caption };
    this.historyPhotos.set(id, updated);
    return updated;
  }

  async deleteHistoryPhoto(id: string): Promise<HistoryPhoto | undefined> {
    const existing = this.historyPhotos.get(id);
    this.historyPhotos.delete(id);
    return existing;
  }

  async getPageBanners(): Promise<Record<string, string>> {
    return Object.fromEntries(this.pageBanners);
  }

  async setPageBanner(page: string, imageSrc: string | null): Promise<string | null> {
    const previous = this.pageBanners.get(page) ?? null;
    if (imageSrc) this.pageBanners.set(page, imageSrc);
    else this.pageBanners.delete(page);
    return previous;
  }
}

export class DatabaseStorage implements IStorage {
  constructor(private db: Database) {}

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: { ...userData, updatedAt: new Date() },
      })
      .returning();
    return user;
  }

  async getPosts(): Promise<Post[]> {
    return this.db.select().from(posts).orderBy(desc(posts.publishedAt));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await this.db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: string, postUpdate: Partial<InsertPost>): Promise<Post | undefined> {
    const [post] = await this.db.update(posts).set(postUpdate).where(eq(posts.id, id)).returning();
    return post;
  }

  async deletePost(id: string): Promise<boolean> {
    const deleted = await this.db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
    return deleted.length > 0;
  }

  async getImage(id: string): Promise<Image | undefined> {
    const [image] = await this.db.select().from(images).where(eq(images.id, id));
    return image;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const [image] = await this.db.insert(images).values(insertImage).returning();
    return image;
  }

  async deleteImage(id: string): Promise<boolean> {
    const deleted = await this.db.delete(images).where(eq(images.id, id)).returning({ id: images.id });
    return deleted.length > 0;
  }

  async getStaffAssignments(): Promise<StaffAssignment[]> {
    return this.db.select().from(staffAssignments);
  }

  async createStaffAssignment(assignment: InsertStaffAssignment): Promise<StaffAssignment> {
    const [row] = await this.db.insert(staffAssignments).values(assignment).returning();
    return row;
  }

  async updateStaffAssignment(
    id: string,
    update: Partial<Pick<InsertStaffAssignment, "team" | "role">>,
  ): Promise<StaffAssignment | undefined> {
    const [row] = await this.db
      .update(staffAssignments)
      .set(update)
      .where(eq(staffAssignments.id, id))
      .returning();
    return row;
  }

  async deleteStaffAssignment(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(staffAssignments)
      .where(eq(staffAssignments.id, id))
      .returning({ id: staffAssignments.id });
    return deleted.length > 0;
  }

  async getTrainingSessions(): Promise<TrainingSession[]> {
    return this.db.select().from(trainingSessions);
  }

  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const [row] = await this.db.insert(trainingSessions).values(session).returning();
    return row;
  }

  async updateTrainingSession(id: string, update: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined> {
    const [row] = await this.db.update(trainingSessions).set(update).where(eq(trainingSessions.id, id)).returning();
    return row;
  }

  async deleteTrainingSession(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(trainingSessions)
      .where(eq(trainingSessions.id, id))
      .returning({ id: trainingSessions.id });
    return deleted.length > 0;
  }

  async getCoachPhotos(): Promise<Map<number, string>> {
    const rows = await this.db.select().from(coachPhotos);
    return new Map(rows.map((r) => [r.hrsPersonId, r.photoUrl]));
  }

  async setCoachPhoto(hrsPersonId: number, photoUrl: string | null): Promise<string | null> {
    const [previous] = await this.db.select().from(coachPhotos).where(eq(coachPhotos.hrsPersonId, hrsPersonId));
    if (photoUrl) {
      await this.db
        .insert(coachPhotos)
        .values({ hrsPersonId, photoUrl })
        .onConflictDoUpdate({ target: coachPhotos.hrsPersonId, set: { photoUrl } });
    } else {
      await this.db.delete(coachPhotos).where(eq(coachPhotos.hrsPersonId, hrsPersonId));
    }
    return previous?.photoUrl ?? null;
  }

  async getClubInfo(): Promise<ClubInfo | undefined> {
    const [row] = await this.db.select().from(clubInfo).where(eq(clubInfo.id, "main"));
    return row && { phone: row.phone, email: row.email, address: row.address, officeHours: row.officeHours };
  }

  async saveClubInfo(info: ClubInfo): Promise<ClubInfo> {
    await this.db
      .insert(clubInfo)
      .values({ id: "main", ...info })
      .onConflictDoUpdate({ target: clubInfo.id, set: { ...info, updatedAt: new Date() } });
    return info;
  }

  async getHistoryContent(): Promise<HistoryContent | undefined> {
    const [row] = await this.db.select().from(historyContent).where(eq(historyContent.id, "main"));
    return row && { intro: row.intro, mission: row.mission, stats: row.stats };
  }

  async saveHistoryContent(content: HistoryContent): Promise<HistoryContent> {
    await this.db
      .insert(historyContent)
      .values({ id: "main", ...content })
      .onConflictDoUpdate({ target: historyContent.id, set: { ...content, updatedAt: new Date() } });
    return content;
  }

  async getHistoryEvents(): Promise<HistoryEvent[]> {
    return this.db.select().from(historyEvents);
  }

  async createHistoryEvent(event: InsertHistoryEvent): Promise<HistoryEvent> {
    const [row] = await this.db
      .insert(historyEvents)
      .values({ ...event, sortYear: sortYearOf(event.year) })
      .returning();
    return row;
  }

  async updateHistoryEvent(id: string, event: InsertHistoryEvent): Promise<HistoryEvent | undefined> {
    const [row] = await this.db
      .update(historyEvents)
      .set({ ...event, sortYear: sortYearOf(event.year) })
      .where(eq(historyEvents.id, id))
      .returning();
    return row;
  }

  async deleteHistoryEvent(id: string): Promise<HistoryEvent | undefined> {
    const [row] = await this.db.delete(historyEvents).where(eq(historyEvents.id, id)).returning();
    return row;
  }

  async getHistoryPhotos(): Promise<HistoryPhoto[]> {
    return this.db.select().from(historyPhotos);
  }

  async createHistoryPhoto(photo: InsertHistoryPhoto): Promise<HistoryPhoto> {
    const [row] = await this.db.insert(historyPhotos).values(photo).returning();
    return row;
  }

  async updateHistoryPhotoCaption(id: string, caption: string): Promise<HistoryPhoto | undefined> {
    const [row] = await this.db.update(historyPhotos).set({ caption }).where(eq(historyPhotos.id, id)).returning();
    return row;
  }

  async deleteHistoryPhoto(id: string): Promise<HistoryPhoto | undefined> {
    const [row] = await this.db.delete(historyPhotos).where(eq(historyPhotos.id, id)).returning();
    return row;
  }

  async getPageBanners(): Promise<Record<string, string>> {
    const rows = await this.db.select().from(pageBanners);
    return Object.fromEntries(rows.map((r) => [r.page, r.imageSrc]));
  }

  async setPageBanner(page: string, imageSrc: string | null): Promise<string | null> {
    const [previous] = await this.db.select().from(pageBanners).where(eq(pageBanners.page, page));
    if (imageSrc) {
      await this.db
        .insert(pageBanners)
        .values({ page, imageSrc })
        .onConflictDoUpdate({ target: pageBanners.page, set: { imageSrc, updatedAt: new Date() } });
    } else {
      await this.db.delete(pageBanners).where(eq(pageBanners.page, page));
    }
    return previous?.imageSrc ?? null;
  }
}

function createStorage(): IStorage {
  if (db) {
    return new DatabaseStorage(db);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL must be set in production");
  }
  console.warn("DATABASE_URL not set: using in-memory storage, data is lost on restart");
  return new MemStorage();
}

export const storage = createStorage();
