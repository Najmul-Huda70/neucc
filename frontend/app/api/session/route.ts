import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token?: string };
  if (!token || typeof token !== "string") {
    return NextResponse.json({ ok: false, error: "Missing token." }, { status: 400 });
  }

  // Reject anything that isn't a validly-signed token from our own backend
  // before trusting it as a cookie value.
  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Matches the jwt plugin's own expiry (see backend lib/auth.ts).
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
