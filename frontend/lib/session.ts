import "server-only";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import type { Role } from "@/types";

export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "neucc_token";


export interface SessionPayload {
  sub: string;
  role: Role;
  profileComplete: boolean;
}
// createRemoteJWKSet caches keys internally, so this module-level instance
// is reused across requests instead of re-fetching JWKS every time.
const JWKS = createRemoteJWKSet(new URL(`${API_URL}/api/auth/jwks`));

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: API_URL });
    if (typeof payload.sub !== "string") return null;
    const role = (payload.role as Role | undefined) ?? "user";
    const profileComplete = (payload.profileComplete as boolean | undefined) ?? false;
    return { sub: payload.sub, role, profileComplete };
  } catch {
    return null;
  }
}
/** For Server Components: who's logged in, if anyone (never throws). */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
