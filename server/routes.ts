import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertFixtureSchema, insertLeagueTableSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const data = insertPostSchema.parse(req.body);
      const post = await storage.createPost(data);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.patch("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const post = await storage.updatePost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deletePost(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Fixtures routes
  app.get("/api/fixtures", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const fixtures = await storage.getFixtures(category);
      res.json(fixtures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fixtures" });
    }
  });

  app.get("/api/fixtures/:id", async (req, res) => {
    try {
      const fixture = await storage.getFixture(req.params.id);
      if (!fixture) {
        return res.status(404).json({ error: "Fixture not found" });
      }
      res.json(fixture);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fixture" });
    }
  });

  app.post("/api/fixtures", isAuthenticated, async (req, res) => {
    try {
      const data = insertFixtureSchema.parse(req.body);
      const fixture = await storage.createFixture(data);
      res.json(fixture);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create fixture" });
    }
  });

  app.patch("/api/fixtures/:id", isAuthenticated, async (req, res) => {
    try {
      const fixture = await storage.updateFixture(req.params.id, req.body);
      if (!fixture) {
        return res.status(404).json({ error: "Fixture not found" });
      }
      res.json(fixture);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fixture" });
    }
  });

  app.delete("/api/fixtures/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteFixture(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Fixture not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fixture" });
    }
  });

  // League table routes
  app.get("/api/league-table", async (req, res) => {
    try {
      const table = await storage.getLeagueTable();
      res.json(table);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch league table" });
    }
  });

  app.get("/api/league-table/:id", async (req, res) => {
    try {
      const row = await storage.getLeagueTableRow(req.params.id);
      if (!row) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.json(row);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch row" });
    }
  });

  app.post("/api/league-table", isAuthenticated, async (req, res) => {
    try {
      const data = insertLeagueTableSchema.parse(req.body);
      const row = await storage.createLeagueTableRow(data);
      res.json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create row" });
    }
  });

  app.patch("/api/league-table/:id", isAuthenticated, async (req, res) => {
    try {
      const row = await storage.updateLeagueTableRow(req.params.id, req.body);
      if (!row) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.json(row);
    } catch (error) {
      res.status(500).json({ error: "Failed to update row" });
    }
  });

  app.delete("/api/league-table/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteLeagueTableRow(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete row" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
