import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireRole } from "../middleware/requireRole.js";

export const newsletterRouter = Router();

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

// POST /api/newsletter — public, dedupes by email instead of allowing
// duplicate rows every time someone resubmits the form.
newsletterRouter.post("/", async (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const db = await getDb();
  const existing = await db
    .collection("newsletter_subscribers")
    .findOne({ email: parsed.data.email });

  if (existing) {
    return res.status(200).json({ ok: true, status: 200, data: { alreadySubscribed: true } });
  }

  const doc = { email: parsed.data.email, subscribedAt: new Date().toISOString() };
  const result = await db.collection("newsletter_subscribers").insertOne(doc);

  res.status(201).json({ ok: true, status: 201, data: { _id: result.insertedId, ...doc } });
});

// GET /api/newsletter — admin only, subscriber count + list.
newsletterRouter.get("/", requireRole("admin"), async (_req, res) => {
  const db = await getDb();
  const items = await db
    .collection("newsletter_subscribers")
    .find({})
    .sort({ subscribedAt: -1 })
    .toArray();

  res.status(200).json({ ok: true, status: 200, data: { items, count: items.length } });
});
