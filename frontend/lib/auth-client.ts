import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/lib/api";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * After a successful signIn/signUp, the backend has set its own-domain
 * session cookie — fine for direct browser -> backend calls, but useless
 * to our Next.js server (different origin, so it never sees that cookie).
 *
 * To let Server Components/proxy.ts know who's logged in, we fetch a
 * short-lived signed JWT from Better Auth's jwt plugin and hand it to our
 * own /api/session route, which stores it as an httpOnly cookie on the
 * *frontend's* domain. proxy.ts later verifies that cookie locally via
 * the backend's JWKS endpoint (see lib/session.ts) — no extra round trip
 * to the backend on every request.
 */
export async function syncFrontendSession(): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/token`, { credentials: "include" });
  if (!res.ok) return;
  const { token } = (await res.json()) as { token?: string };
  if (!token) return;

  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export async function clearFrontendSession(): Promise<void> {
  await signOut();
  await fetch("/api/session", { method: "DELETE" });
}
