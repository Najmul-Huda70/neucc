import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const attendeesRouter = Router();

const attendeeSchema = z.object({
  eventId: z.string().min(1),
});

// POST /api/attendees — any logged-in user marks interest in a
// non-Election event. Backs the "Register interest" button that was
// previously just a client-side toast with no record anywhere.
attendeesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = attendeeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const db = await getDb();
  const userId = (req as any).userId;

  const existing = await db.collection("attendees").findOne({
    eventId: parsed.data.eventId,
    userId,
  });

  if (existing) {
    return res
      .status(200)
      .json({ ok: true, status: 200, data: { alreadyRegistered: true } });
  }

  const doc = {
    eventId: parsed.data.eventId,
    userId,
    registeredAt: new Date().toISOString(),
  };
  const result = await db.collection("attendees").insertOne(doc);

  res.status(201).json({ ok: true, status: 201, data: { _id: result.insertedId, ...doc } });
});

// DELETE /api/attendees/:eventId — the logged-in user withdraws interest.
attendeesRouter.delete("/:eventId", requireAuth, async (req, res) => {
  const db = await getDb();
  const userId = (req as any).userId;

  const result = await db.collection("attendees").deleteOne({
    eventId: req.params.eventId,
    userId,
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ ok: false, status: 404, error: "No registration found." });
  }

  res.status(200).json({ ok: true, status: 200, data: { deleted: true } });
});

// GET /api/attendees/count?eventId=... — public, powers a "N people
// interested" label without exposing who registered.
attendeesRouter.get("/count", async (req, res) => {
  const { eventId } = req.query;

  if (!eventId || typeof eventId !== "string") {
    return res.status(400).json({ ok: false, status: 400, error: "eventId query param is required." });
  }

  const db = await getDb();
  const count = await db.collection("attendees").countDocuments({ eventId });

  res.status(200).json({ ok: true, status: 200, data: { count } });
});

// GET /api/attendees/mine — whether the logged-in user has already
// registered interest, per event, so the button can render correctly
// after a page refresh instead of resetting to "Register interest".
attendeesRouter.get("/mine", requireAuth, async (req, res) => {
  const db = await getDb();
  const items = await db
    .collection("attendees")
    .find({ userId: (req as any).userId })
    .project({ eventId: 1, _id: 0 })
    .toArray();

  res.status(200).json({
    ok: true,
    status: 200,
    data: { eventIds: items.map((i) => (i as unknown as { eventId: string }).eventId) },
  });
});
