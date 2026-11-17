import type { Express, RequestHandler } from "express";
import { z } from "zod";
import {
  historyContentSchema,
  insertHistoryEventSchema,
  insertHistoryPhotoSchema,
  type HistoryPage,
} from "@shared/schema";
import { storage } from "./storage";
import { HISTORY_SEED_CONTENT, HISTORY_SEED_EVENTS } from "./historySeed";

// Writes the initial history content once. The content row marks the page as initialised,
// so deleting all events later does not bring the seed back.
let seeding: Promise<void> | undefined;
async function ensureSeeded() {
  if (await storage.getHistoryContent()) return;
  seeding ??= (async () => {
    for (const event of HISTORY_SEED_EVENTS) {
      await storage.createHistoryEvent(event);
    }
    await storage.saveHistoryContent(HISTORY_SEED_CONTENT);
  })().finally(() => {
    seeding = undefined;
  });
  await seeding;
}

async function getHistoryPage(): Promise<HistoryPage> {
  await ensureSeeded();
  const [content, events, photos] = await Promise.all([
    storage.getHistoryContent(),
    storage.getHistoryEvents(),
    storage.getHistoryPhotos(),
  ]);
  return {
    content: content ?? HISTORY_SEED_CONTENT,
    // Newest first; same start year ordered by its text, later first ("2010./11." before "2010.").
    events: events.sort((a, b) => b.sortYear - a.sortYear || b.year.localeCompare(a.year, "hr")),
    photos: photos.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  };
}

function sendError(res: Parameters<RequestHandler>[1], error: unknown, action: string) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.errors });
  }
  console.error(`History: failed to ${action}:`, error);
  res.status(500).json({ error: `Failed to ${action}` });
}

export function registerHistoryRoutes(
  app: Express,
  isAuthenticated: RequestHandler,
  deleteUploadedImage: (imageSrc: string | null | undefined) => Promise<void>,
) {
  app.get("/api/history", async (_req, res) => {
    try {
      res.json(await getHistoryPage());
    } catch (error) {
      sendError(res, error, "load history");
    }
  });

  app.put("/api/history/content", isAuthenticated, async (req, res) => {
    try {
      res.json(await storage.saveHistoryContent(historyContentSchema.parse(req.body)));
    } catch (error) {
      sendError(res, error, "save history texts");
    }
  });

  app.post("/api/history/events", isAuthenticated, async (req, res) => {
    try {
      await ensureSeeded(); // so a first manual entry is not followed by the seed
      res.json(await storage.createHistoryEvent(insertHistoryEventSchema.parse(req.body)));
    } catch (error) {
      sendError(res, error, "add event");
    }
  });

  app.put("/api/history/events/:id", isAuthenticated, async (req, res) => {
    try {
      const data = insertHistoryEventSchema.parse(req.body);
      const previous = (await storage.getHistoryEvents()).find((e) => e.id === req.params.id);
      if (!previous) {
        return res.status(404).json({ error: "Event not found" });
      }
      const updated = await storage.updateHistoryEvent(req.params.id, data);
      if (previous.imageSrc !== data.imageSrc) {
        await deleteUploadedImage(previous.imageSrc);
      }
      res.json(updated);
    } catch (error) {
      sendError(res, error, "save event");
    }
  });

  app.delete("/api/history/events/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteHistoryEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      await deleteUploadedImage(deleted.imageSrc);
      res.json({ success: true });
    } catch (error) {
      sendError(res, error, "delete event");
    }
  });

  app.post("/api/history/photos", isAuthenticated, async (req, res) => {
    try {
      res.json(await storage.createHistoryPhoto(insertHistoryPhotoSchema.parse(req.body)));
    } catch (error) {
      sendError(res, error, "add photo");
    }
  });

  app.patch("/api/history/photos/:id", isAuthenticated, async (req, res) => {
    try {
      const { caption } = insertHistoryPhotoSchema.pick({ caption: true }).parse(req.body);
      const updated = await storage.updateHistoryPhotoCaption(req.params.id, caption);
      if (!updated) {
        return res.status(404).json({ error: "Photo not found" });
      }
      res.json(updated);
    } catch (error) {
      sendError(res, error, "save caption");
    }
  });

  app.delete("/api/history/photos/:id", isAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteHistoryPhoto(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Photo not found" });
      }
      await deleteUploadedImage(deleted.imageSrc);
      res.json({ success: true });
    } catch (error) {
      sendError(res, error, "delete photo");
    }
  });
}
