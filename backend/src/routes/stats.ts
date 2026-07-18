import { Router } from "express";
import { getDb } from "../db.js";
import type { ApiResponse, StatsSummary } from "../types.js";

export const statsRouter = Router();

// GET /api/stats — public. Every number here is a live aggregate against
// real collections, not fabricated history — we don't have multi-year
// snapshots, so we don't pretend to (see StatsSummary: current-state
// breakdowns only, e.g. events by category / members by batch).
statsRouter.get("/", async (_req, res) => {
  const db = await getDb();
  const today = new Date().toISOString();

  const [
    totalMembers,
    totalEvents,
    upcomingEvents,
    totalNominations,
    approvedNominations,
    eventsByCategoryRaw,
    membersByBatchRaw,
  ] = await Promise.all([
    db.collection("user").countDocuments({}),
    db.collection("events").countDocuments({}),
    db.collection("events").countDocuments({ date: { $gte: today } }),
    db.collection("nominations").countDocuments({}),
    db.collection("nominations").countDocuments({ status: "approved" }),
    db
      .collection("events")
      .aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
      .toArray(),
    db
      .collection("user")
      .aggregate([{ $group: { _id: "$batch", count: { $sum: 1 } } }])
      .toArray(),
  ]);

  const data: StatsSummary = {
    totalMembers,
    totalEvents,
    upcomingEvents,
    totalNominations,
    approvedNominations,
    eventsByCategory: eventsByCategoryRaw.map((r) => ({
      category: r._id,
      count: r.count,
    })) as StatsSummary["eventsByCategory"],
    membersByBatch: membersByBatchRaw.map((r) => ({
      batch: r._id,
      count: r.count,
    })) as StatsSummary["membersByBatch"],
  };

  const body: ApiResponse<StatsSummary> = { ok: true, status: 200, data };
  res.status(200).json(body);
});
