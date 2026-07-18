import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import type { Role } from "../types.js";

// Broader than requireRole — just proves "someone is logged in" and attaches
// their id/role to the request. Use requireRole when the route needs to be
// restricted further (e.g. admin-only writes).
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: req.headers as any });

  if (!session?.user) {
    return res.status(401).json({ ok: false, status: 401, error: "Not authenticated." });
  }

  const role = ((session.user as { role?: string }).role ?? "user") as Role;

  (req as Request & { userId: string; role: Role }).userId = session.user.id;
  (req as Request & { userId: string; role: Role }).role = role;
  next();
}
