import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import type { Role } from "../types.js";

// Never trust the frontend's proxy.ts check alone — the backend is the
// real gatekeeper. This re-verifies the session on every protected write.
export function requireRole(...allowed: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session?.user) {
      return res.status(401).json({ ok: false, status: 401, error: "Not authenticated." });
    }

    const role = ((session.user as { role?: string }).role ?? "user") as Role;

    if (!allowed.includes(role)) {
      return res.status(403).json({ ok: false, status: 403, error: "Not authorized." });
    }

    (req as Request & { userId: string; role: Role }).userId = session.user.id;
    (req as Request & { userId: string; role: Role }).role = role;
    next();
  };
}
