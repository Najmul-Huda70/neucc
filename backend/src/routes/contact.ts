import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db.js";
import { requireRole } from "../middleware/requireRole.js";
import type { ApiResponse, ContactMessage } from "../types.js";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(2000),
});

// POST /api/contact — public. Replaces the frontend's console.log stub
// with a real `contact_messages` collection write.
contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, status: 400, error: parsed.error.message });
  }

  const db = await getDb();
  const doc = { ...parsed.data, createdAt: new Date().toISOString() };
  const result = await db.collection("contact_messages").insertOne(doc);

  res.status(201).json({ ok: true, status: 201, data: { _id: result.insertedId, ...doc } });
});

// GET /api/contact — admin only, so submitted messages are actually reachable.
contactRouter.get("/", requireRole("admin"), async (_req, res) => {
  const db = await getDb();
  const items = await db
    .collection<ContactMessage>("contact_messages")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const body: ApiResponse<ContactMessage[]> = { ok: true, status: 200, data: items };
  res.status(200).json(body);
});
