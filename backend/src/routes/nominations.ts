import { Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";
import type { ApiResponse, Nomination } from "../types.js";

export const nominationsRouter = Router();

const nominationSchema = z.object({
  eventId: z.string().refine((v) => ObjectId.isValid(v), "Invalid eventId"),
  position: z.string().min(2),
  batchYear: z.enum(["1st year", "2nd year", "3rd year", "final year"]),
  supporterName: z.string().min(2),
  supporterId: z.string().min(2),
  representativeName: z.string().min(2),
  representativeId: z.string().min(2),
  photoUrl: z.string().url(),
});

const statusSchema = z.object({
  status: z.enum(["pending", "approved", "disqualified"]),
});

// POST /api/nominations — any authenticated (CSE) student can apply
nominationsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = nominationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const userId = (req as any).userId as string;
  const db = await getDb();

  // Rule: one position per candidate — reject if this user already has a
  // non-disqualified nomination for this election event.
  const existing = await db.collection("nominations").findOne({
    candidateId: userId,
    eventId: parsed.data.eventId,
    status: { $ne: "disqualified" },
  });

  if (existing) {
    return res
      .status(409)
      .json({ ok: false, status: 409, error: "You already have an active nomination for this election." });
  }

  const doc = {
    ...parsed.data,
    candidateId: userId,
    status: "pending" as const,
    appliedAt: new Date().toISOString(),
  };

  const result = await db.collection("nominations").insertOne(doc);
  res.status(201).json({ ok: true, status: 201, data: { _id: result.insertedId, ...doc } });
});

// GET /api/nominations/mine — the logged-in user's own nominations
nominationsRouter.get("/mine", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const db = await getDb();
  const items = await db
    .collection<Nomination>("nominations")
    .find({ candidateId: userId })
    .sort({ appliedAt: -1 })
    .toArray();

  res.status(200).json({ ok: true, status: 200, data: items });
});

// GET /api/nominations — admin (Election Commission) only, optional eventId/status filters
nominationsRouter.get("/", requireRole("admin"), async (req, res) => {
  const { eventId, status } = req.query;
  const filter: Record<string, unknown> = {};
  if (eventId && typeof eventId === "string") filter.eventId = eventId;
  if (status && typeof status === "string") filter.status = status;

  const db = await getDb();
  const items = await db
    .collection<Nomination>("nominations")
    .find(filter)
    .sort({ appliedAt: -1 })
    .toArray();

  const body: ApiResponse<Nomination[]> = { ok: true, status: 200, data: items };
  res.status(200).json(body);
});

// PATCH /api/nominations/:id/status — admin only (approve / disqualify)
nominationsRouter.patch("/:id/status", requireRole("admin"), async (req, res) => {
  const id = req.params.id as string;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid nomination id." });
  }

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const db = await getDb();
  const result = await db
    .collection<Nomination>("nominations")
    .findOneAndUpdate(
      { _id: new ObjectId(id) as unknown as string },
      { $set: { status: parsed.data.status } },
      { returnDocument: "after" }
    );

  if (!result) {
    return res.status(404).json({ ok: false, status: 404, error: "Nomination not found." });
  }

  res.status(200).json({ ok: true, status: 200, data: result });
});

// DELETE /api/nominations/:id — owner (only while pending) or admin
nominationsRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid nomination id." });
  }

  const db = await getDb();
  const userId = (req as any).userId as string;
  const role = (req as any).role as string;

  const nomination = await db
    .collection<Nomination>("nominations")
    .findOne({ _id: new ObjectId(id) as unknown as string });

  if (!nomination) {
    return res.status(404).json({ ok: false, status: 404, error: "Nomination not found." });
  }

  const isOwner = nomination.candidateId === userId;
  if (!isOwner && role !== "admin") {
    return res.status(403).json({ ok: false, status: 403, error: "Not authorized." });
  }
  if (isOwner && role !== "admin" && nomination.status !== "pending") {
    return res
      .status(403)
      .json({ ok: false, status: 403, error: "Only pending nominations can be withdrawn." });
  }

  await db
    .collection<Nomination>("nominations")
    .deleteOne({ _id: new ObjectId(id) as unknown as string });

  res.status(200).json({ ok: true, status: 200, data: { deleted: true } });
});
