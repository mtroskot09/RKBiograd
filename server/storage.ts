import { type User, type UpsertUser, type Post, type InsertPost, type Fixture, type InsertFixture, type LeagueTableRow, type InsertLeagueTable } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  
  getFixtures(category?: string): Promise<Fixture[]>;
  getFixture(id: string): Promise<Fixture | undefined>;
  createFixture(fixture: InsertFixture): Promise<Fixture>;
  updateFixture(id: string, fixture: Partial<InsertFixture>): Promise<Fixture | undefined>;
  deleteFixture(id: string): Promise<boolean>;
  
  getLeagueTable(): Promise<LeagueTableRow[]>;
  getLeagueTableRow(id: string): Promise<LeagueTableRow | undefined>;
  createLeagueTableRow(row: InsertLeagueTable): Promise<LeagueTableRow>;
  updateLeagueTableRow(id: string, row: Partial<InsertLeagueTable>): Promise<LeagueTableRow | undefined>;
  deleteLeagueTableRow(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private fixtures: Map<string, Fixture>;
  private leagueTable: Map<string, LeagueTableRow>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.fixtures = new Map();
    this.leagueTable = new Map();
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

  async getFixtures(category?: string): Promise<Fixture[]> {
    const all = Array.from(this.fixtures.values());
    if (category) {
      return all.filter(f => f.category === category);
    }
    return all;
  }

  async getFixture(id: string): Promise<Fixture | undefined> {
    return this.fixtures.get(id);
  }

  async createFixture(insertFixture: InsertFixture): Promise<Fixture> {
    const id = randomUUID();
    const fixture: Fixture = {
      ...insertFixture,
      id,
      category: insertFixture.category ?? "Prva ekipa",
      homeScore: insertFixture.homeScore ?? null,
      awayScore: insertFixture.awayScore ?? null,
      time: insertFixture.time ?? null,
    };
    this.fixtures.set(id, fixture);
    return fixture;
  }

  async updateFixture(id: string, fixtureUpdate: Partial<InsertFixture>): Promise<Fixture | undefined> {
    const existing = this.fixtures.get(id);
    if (!existing) return undefined;
    
    const updated: Fixture = { ...existing, ...fixtureUpdate };
    this.fixtures.set(id, updated);
    return updated;
  }

  async deleteFixture(id: string): Promise<boolean> {
    return this.fixtures.delete(id);
  }

  async getLeagueTable(): Promise<LeagueTableRow[]> {
    return Array.from(this.leagueTable.values()).sort((a, b) => a.position - b.position);
  }

  async getLeagueTableRow(id: string): Promise<LeagueTableRow | undefined> {
    return this.leagueTable.get(id);
  }

  async createLeagueTableRow(insertRow: InsertLeagueTable): Promise<LeagueTableRow> {
    const id = randomUUID();
    const row: LeagueTableRow = {
      ...insertRow,
      id,
      played: insertRow.played ?? 0,
      won: insertRow.won ?? 0,
      draw: insertRow.draw ?? 0,
      lost: insertRow.lost ?? 0,
      goalsFor: insertRow.goalsFor ?? 0,
      goalsAgainst: insertRow.goalsAgainst ?? 0,
      goalDiff: insertRow.goalDiff ?? 0,
      points: insertRow.points ?? 0,
      isOurTeam: insertRow.isOurTeam ?? false,
    };
    this.leagueTable.set(id, row);
    return row;
  }

  async updateLeagueTableRow(id: string, rowUpdate: Partial<InsertLeagueTable>): Promise<LeagueTableRow | undefined> {
    const existing = this.leagueTable.get(id);
    if (!existing) return undefined;
    
    const updated: LeagueTableRow = { ...existing, ...rowUpdate };
    this.leagueTable.set(id, updated);
    return updated;
  }

  async deleteLeagueTableRow(id: string): Promise<boolean> {
    return this.leagueTable.delete(id);
  }
}

export const storage = new MemStorage();
