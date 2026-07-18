import { Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireRole } from "../middleware/requireRole.js";
import type { ApiResponse, EventDoc } from "../types.js";

export const eventsRouter = Router();

const eventSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(3),
  fullDescription: z.string().min(10),
  category: z.enum(["Contest", "Fest", "Workshop", "Sports", "Seminar", "Social", "Election"]),
  date: z.string(),
  venue: z.string().min(2),
  fee: z.union([z.number().nonnegative(), z.literal("Free")]),
  imageUrl: z.string().url(),
  images: z.array(z.string().url()).default([]),
  specs: z.record(z.string()).default({}),
  // Controls display order — higher number surfaces the event higher in the
  // grid/hero slider (e.g. Election or flagship events can be pinned to the
  // top). Defaults to 0 (no particular priority) if omitted.
  priority: z.number().int().min(0).max(999).default(0),
});

// GET /api/events — public, supports search/filter/sort/pagination
eventsRouter.get("/", async (req, res) => {
  const db = await getDb();
  const {
    search,
    category,
    dateFrom,
    dateTo,
    feeType, // "free" | "paid"
    sort = "date",
    page = "1",
    limit = "12",
  } = req.query;

  const filter: Record<string, unknown> = {};
  if (search && typeof search === "string") {
    filter.title = { $regex: search, $options: "i" };
  }
  if (category && typeof category === "string") {
    filter.category = category;
  }
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, string> = {};
    if (dateFrom && typeof dateFrom === "string") dateFilter.$gte = dateFrom;
    if (dateTo && typeof dateTo === "string") dateFilter.$lte = dateTo;
    filter.date = dateFilter;
  }
  if (feeType === "free") {
    filter.fee = "Free";
  } else if (feeType === "paid") {
    filter.fee = { $ne: "Free" };
  }

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.min(50, parseInt(String(limit), 10) || 12);

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    date: { priority: -1, date: 1 },
    "fee-asc": { fee: 1 },
    "fee-desc": { fee: -1 },
    priority: { priority: -1, date: 1 },
  };

  const cursor = db
    .collection<EventDoc>("events")
    .find(filter)
    .sort(sortMap[String(sort)] ?? sortMap.date)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const [items, total] = await Promise.all([
    cursor.toArray(),
    db.collection("events").countDocuments(filter),
  ]);

  const body: ApiResponse<{ items: EventDoc[]; total: number; page: number }> = {
    ok: true,
    status: 200,
    data: { items: items as unknown as EventDoc[], total, page: pageNum },
  };
  res.status(200).json(body);
});

// GET /api/events/:id — public
eventsRouter.get("/:id", async (req, res) => {
  const db = await getDb();
  const id = req.params.id as string;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid event id." });
  }

  const event = await db.collection<EventDoc>("events").findOne({
    _id: new ObjectId(id) as unknown as string,
  });

  if (!event) {
    return res.status(404).json({ ok: false, status: 404, error: "Event not found." });
  }

  res.status(200).json({ ok: true, status: 200, data: event });
});

// POST /api/events — admin only
eventsRouter.post("/", requireRole("admin"), async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const db = await getDb();
  const doc = {
    ...parsed.data,
    createdBy: (req as any).userId,
    createdAt: new Date().toISOString(),
  };

  const result = await db.collection("events").insertOne(doc);

  res.status(201).json({ ok: true, status: 201, data: { _id: result.insertedId, ...doc } });
});

// PATCH /api/events/:id — admin only (partial update, e.g. from Manage events UI)
eventsRouter.patch("/:id", requireRole("admin"), async (req, res) => {
  const id = req.params.id as string;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid event id." });
  }

  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }
  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ ok: false, status: 400, error: "No fields to update." });
  }

  const db = await getDb();
  const result = await db
    .collection<EventDoc>("events")
    .findOneAndUpdate(
      { _id: new ObjectId(id) as unknown as string },
      { $set: parsed.data },
      { returnDocument: "after" }
    );

  if (!result) {
    return res.status(404).json({ ok: false, status: 404, error: "Event not found." });
  }

  res.status(200).json({ ok: true, status: 200, data: result });
});

// DELETE /api/events/:id — admin only
eventsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const id = req.params.id as string;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, status: 400, error: "Invalid event id." });
  }

  const db = await getDb();
  const result = await db.collection<EventDoc>("events").deleteOne({
    _id: new ObjectId(id) as unknown as string,
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ ok: false, status: 404, error: "Event not found." });
  }

  res.status(200).json({ ok: true, status: 200, data: { deleted: true } });
});
