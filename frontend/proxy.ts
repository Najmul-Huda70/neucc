import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Routes that merely require *some* logged-in user (backend uses
// requireAuth, not requireRole, for these — see backend/src/routes).
const AUTH_ONLY = ["/election/apply", "/profile"];
// Routes restricted to the admin role (backend uses requireRole("admin")
// here — events POST/PATCH/DELETE and nomination approve/disqualify).
// Election Commission is folded into "admin" per CHANGELOG's role simplification.
const ADMIN_ONLY = ["/events/add", "/events/manage", "/election/manage", "/admin"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// /events/:id/edit is admin-only too, but its dynamic `:id` segment doesn't
// fit the plain-prefix check above.
const EVENT_EDIT_RE = /^\/events\/[^/]+\/edit(\/.*)?$/;

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isEventEdit = EVENT_EDIT_RE.test(pathname);
  const isAdminRoute = matches(pathname, ADMIN_ONLY) || isEventEdit;
  const needsAuth = matches(pathname, AUTH_ONLY) || isAdminRoute;
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session.role !== "admin") {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("denied", "1");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/events/add/:path*",
    "/events/manage/:path*",
    "/events/:id/edit",
    "/election/apply/:path*",
    "/election/manage/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
