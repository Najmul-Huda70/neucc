import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { eventsRouter } from "./routes/events.js";
import { nominationsRouter } from "./routes/nominations.js";
import { reviewsRouter } from "./routes/reviews.js";
import { uploadRouter } from "./routes/upload.js";
import { contactRouter } from "./routes/contact.js";
import { newsletterRouter } from "./routes/newsletter.js";
import { attendeesRouter } from "./routes/attendees.js";
import { statsRouter } from "./routes/stats.js";

const app = express();
const PORT = process.env.PORT || 5000;

const trustedOrigins = (process.env.TRUSTED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: trustedOrigins,
    credentials: true,
  })
);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
app.use("/api/auth/sign-in", authLimiter);
app.use("/api/auth/sign-up", authLimiter);

// Better Auth mounts its own routes — must come before express.json()
// so it can read the raw body correctly.
app.all("/api/auth/*splat", toNodeHandler(auth));
// Higher limit than the 100kb default — base64-encoded images (for the
// ImgBB upload proxy) need room. Routes validate their own payload shape.
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, status: 200, data: { status: "healthy" } });
});

app.use("/api/events", eventsRouter);
app.use("/api/nominations", nominationsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/attendees", attendeesRouter);
app.use("/api/stats", statsRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ ok: false, status: 404, error: "Route not found." });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ ok: false, status: 500, error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
