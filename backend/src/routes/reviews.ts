import { Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import type { ApiResponse, EventDoc, Review } from "../types.js";

export const reviewsRouter = Router();

const reviewSchema = z.object({
  eventId: z.string().refine((v) => ObjectId.isValid(v), "Invalid eventId"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

// GET /api/reviews/event/:eventId — public, plus an aggregate average rating
reviewsRouter.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  if (!ObjectId.isValid(eventId)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid eventId." });
  }

  const db = await getDb();
  const items = await db
    .collection<Review>("reviews")
    .find({ eventId })
    .sort({ createdAt: -1 })
    .toArray();

  const average =
    items.length === 0 ? 0 : items.reduce((sum, r) => sum + r.rating, 0) / items.length;

  const body: ApiResponse<{ items: Review[]; average: number; count: number }> = {
    ok: true,
    status: 200,
    data: { items, average: Math.round(average * 10) / 10, count: items.length },
  };
  res.status(200).json(body);
});

// POST /api/reviews — authenticated, one review per user per event (upsert)
reviewsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const userId = (req as any).userId as string;
  const db = await getDb();

  const eventExists = await db
    .collection<EventDoc>("events")
    .findOne({ _id: new ObjectId(parsed.data.eventId) as unknown as string });
  if (!eventExists) {
    return res.status(404).json({ ok: false, status: 404, error: "Event not found." });
  }

  const doc = {
    eventId: parsed.data.eventId,
    userId,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    createdAt: new Date().toISOString(),
  };

  const result = await db
    .collection("reviews")
    .findOneAndUpdate(
      { eventId: parsed.data.eventId, userId },
      { $set: doc },
      { upsert: true, returnDocument: "after" }
    );

  res.status(201).json({ ok: true, status: 201, data: result });
});

// DELETE /api/reviews/:id — owner or admin
reviewsRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid review id." });
  }

  const db = await getDb();
  const userId = (req as any).userId as string;
  const role = (req as any).role as string;

  const review = await db
    .collection<Review>("reviews")
    .findOne({ _id: new ObjectId(id) as unknown as string });

  if (!review) {
    return res.status(404).json({ ok: false, status: 404, error: "Review not found." });
  }
  if (review.userId !== userId && role !== "admin") {
    return res.status(403).json({ ok: false, status: 403, error: "Not authorized." });
  }

  await db.collection<Review>("reviews").deleteOne({ _id: new ObjectId(id) as unknown as string });
  res.status(200).json({ ok: true, status: 200, data: { deleted: true } });
});
