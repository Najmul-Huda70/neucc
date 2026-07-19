import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const AUTH_ONLY = ["/election/apply", "/profile", "/ai-generator"];
const ADMIN_ONLY = ["/events/add", "/events/manage", "/election/manage", "/admin"];

// NOTUN: ei route-gulor jonno studentId/batch complete thaka lagbe
const PROFILE_REQUIRED = ["/election/apply"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

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

  // NOTUN: profile incomplete hole election apply-e jete dibo na
  if (matches(pathname, PROFILE_REQUIRED) && !session.profileComplete) {
    const profileUrl = new URL("/profile", request.url);
    profileUrl.searchParams.set("complete", "1");
    return NextResponse.redirect(profileUrl);
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
    "/ai-generator/:path*",
  ],
};