import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPostSchema,
  insertStaffAssignmentSchema,
  updateStaffAssignmentSchema,
  insertTrainingSessionSchema,
  updateTrainingSessionSchema,
  STAFF_ROLES,
  type StaffRole,
  type StaffMember,
  coachPhotoSchema,
  clubInfoSchema,
  DEFAULT_CLUB_INFO,
  PAGE_BANNER_KEYS,
  pageBannerSchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./auth";
import { registerHrsRoutes } from "./hrs/routes";
import { registerHistoryRoutes } from "./historyRoutes";

const IMAGE_URL_PREFIX = "/api/images/";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, true> = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
};

// Removes an image uploaded through /api/images once no post uses it. External URLs are ignored.
async function deleteUploadedImage(imageSrc: string | null | undefined) {
  if (imageSrc?.startsWith(IMAGE_URL_PREFIX)) {
    await storage.deleteImage(imageSrc.slice(IMAGE_URL_PREFIX.length));
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Health check for the hosting platform (Render pings this to know the app is up).
  app.get("/healthz", (_req, res) => {
    res.json({ ok: true });
  });

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
      const data = insertPostSchema.partial().parse(req.body);
      const existing = await storage.getPost(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Post not found" });
      }
      const post = await storage.updatePost(req.params.id, data);
      if (data.imageSrc !== undefined && data.imageSrc !== existing.imageSrc) {
        await deleteUploadedImage(existing.imageSrc);
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    try {
      const existing = await storage.getPost(req.params.id);
      if (!existing || !(await storage.deletePost(req.params.id))) {
        return res.status(404).json({ error: "Post not found" });
      }
      await deleteUploadedImage(existing.imageSrc);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Image uploads (stored in the database, see shared/schema.ts)
  app.post(
    "/api/images",
    isAuthenticated,
    express.raw({ type: Object.keys(IMAGE_TYPES), limit: MAX_IMAGE_BYTES }),
    async (req, res) => {
      const contentType = req.headers["content-type"] ?? "";
      if (!(contentType in IMAGE_TYPES) || !Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: "Dozvoljene su samo JPG, PNG, WebP ili GIF slike" });
      }
      try {
        const image = await storage.createImage({ contentType, data: req.body });
        res.json({ url: `${IMAGE_URL_PREFIX}${image.id}` });
      } catch (error) {
        console.error("Image upload failed:", error);
        res.status(500).json({ error: "Failed to upload image" });
      }
    },
  );

  app.get(`${IMAGE_URL_PREFIX}:id`, async (req, res) => {
    try {
      const image = await storage.getImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      // Image ids are never reused, so the response can be cached forever.
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.type(image.contentType).send(image.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  // Coaching staff: admins assign HRS officials to teams with a role
  app.get("/api/staff", async (_req, res) => {
    try {
      const [assignments, photos] = await Promise.all([storage.getStaffAssignments(), storage.getCoachPhotos()]);
      const roleOrder = (role: string) => STAFF_ROLES.indexOf(role as StaffRole);
      const staff: StaffMember[] = assignments
        .map((s) => ({ ...s, photoUrl: photos.get(s.hrsPersonId) ?? null }))
        .sort(
          (a, b) =>
            roleOrder(a.role) - roleOrder(b.role) ||
            a.lastName.localeCompare(b.lastName, "hr") ||
            a.firstName.localeCompare(b.firstName, "hr"),
        );
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  // One photo per coach (HRS person id), used on every team they are assigned to.
  app.put("/api/staff/photos/:personId", isAuthenticated, async (req, res) => {
    try {
      const personId = Number(req.params.personId);
      if (!Number.isInteger(personId) || personId <= 0) {
        return res.status(404).json({ error: "Coach not found" });
      }
      const { photoUrl } = coachPhotoSchema.parse(req.body);
      const previous = await storage.setCoachPhoto(personId, photoUrl);
      if (previous !== photoUrl) {
        await deleteUploadedImage(previous);
      }
      res.json({ hrsPersonId: personId, photoUrl });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save photo" });
    }
  });

  // Top images (banner / hero) per page; pages not listed use their built-in default
  app.get("/api/page-banners", async (_req, res) => {
    try {
      res.json(await storage.getPageBanners());
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page banners" });
    }
  });

  app.put("/api/page-banners/:page", isAuthenticated, async (req, res) => {
    try {
      const page = req.params.page;
      if (!(PAGE_BANNER_KEYS as readonly string[]).includes(page)) {
        return res.status(404).json({ error: "Page not found" });
      }
      const { imageSrc } = pageBannerSchema.parse(req.body);
      const previous = await storage.setPageBanner(page, imageSrc);
      if (previous !== imageSrc) {
        await deleteUploadedImage(previous);
      }
      res.json({ page, imageSrc });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save page banner" });
    }
  });

  // Club contact details (footer and contact page)
  app.get("/api/club-info", async (_req, res) => {
    try {
      res.json((await storage.getClubInfo()) ?? DEFAULT_CLUB_INFO);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch club info" });
    }
  });

  app.put("/api/club-info", isAuthenticated, async (req, res) => {
    try {
      res.json(await storage.saveClubInfo(clubInfoSchema.parse(req.body)));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save club info" });
    }
  });

  app.post("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const data = insertStaffAssignmentSchema.parse(req.body);
      const existing = await storage.getStaffAssignments();
      if (existing.some((s) => s.team === data.team && s.hrsPersonId === data.hrsPersonId)) {
        return res.status(409).json({ error: "This person is already assigned to this team" });
      }
      res.json(await storage.createStaffAssignment(data));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add staff member" });
    }
  });

  app.patch("/api/staff/:id", isAuthenticated, async (req, res) => {
    try {
      const data = updateStaffAssignmentSchema.parse(req.body);
      const existing = await storage.getStaffAssignments();
      const current = existing.find((s) => s.id === req.params.id);
      if (!current) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      if (
        data.team &&
        existing.some((s) => s.id !== current.id && s.team === data.team && s.hrsPersonId === current.hrsPersonId)
      ) {
        return res.status(409).json({ error: "This person is already assigned to this team" });
      }
      res.json(await storage.updateStaffAssignment(req.params.id, data));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update staff member" });
    }
  });

  app.delete("/api/staff/:id", isAuthenticated, async (req, res) => {
    try {
      if (!(await storage.deleteStaffAssignment(req.params.id))) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete staff member" });
    }
  });

  // Training schedule per team, edited by admins
  app.get("/api/trainings", async (_req, res) => {
    try {
      const sessions = await storage.getTrainingSessions();
      sessions.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trainings" });
    }
  });

  app.post("/api/trainings", isAuthenticated, async (req, res) => {
    try {
      const data = insertTrainingSessionSchema.parse(req.body);
      res.json(await storage.createTrainingSession(data));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create training" });
    }
  });

  app.patch("/api/trainings/:id", isAuthenticated, async (req, res) => {
    try {
      const data = updateTrainingSessionSchema.parse(req.body);
      const current = (await storage.getTrainingSessions()).find((s) => s.id === req.params.id);
      if (!current) {
        return res.status(404).json({ error: "Training not found" });
      }
      // Validate the merged result so a partial update cannot end before it starts.
      insertTrainingSessionSchema.parse({ ...current, ...data });
      res.json(await storage.updateTrainingSession(req.params.id, data));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update training" });
    }
  });

  app.delete("/api/trainings/:id", isAuthenticated, async (req, res) => {
    try {
      if (!(await storage.deleteTrainingSession(req.params.id))) {
        return res.status(404).json({ error: "Training not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete training" });
    }
  });

  // History page: texts, timeline and photo gallery (edited in Admin → History)
  registerHistoryRoutes(app, isAuthenticated, deleteUploadedImage);

  // HRS data: standings, matches, players, match details (read-only, live from the HRS feed)
  registerHrsRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
