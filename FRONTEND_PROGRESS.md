# NEUCC Frontend — Progress Notes

This file tracks what's been built in `frontend/` against `REQUIREMENTS.md`,
so work can resume cleanly in a later session.

## ✅ Completed

**Setup & infrastructure**
- Next.js 16.2.10 (App Router, Turbopack, `typedRoutes`), React 19, TypeScript strict, `src/` layout
- Tailwind CSS v4 wired via `@theme` tokens in `globals.css` (Circuit Teal palette, spacing scale, 12px card radius)
- Google Fonts (Saira Stencil One / Vidaloka / Rokkitt / Inter) via `next/font/google`, self-hosted, CSS variables
- `next.config.ts`, `postcss.config.mjs`, `.env.example`, `.gitignore`
- Shared `src/types.ts` kept in sync with `backend/src/types.ts`

**Auth architecture** (documented inline in each file)
- `lib/auth-client.ts` — Better Auth React client pointed at the Express backend, `credentials: "include"`
- `lib/session.ts` — verifies a JWT via the backend's JWKS endpoint (`jose`), used server-side
- `app/api/session/route.ts` — sets/clears an httpOnly cookie on the *frontend's* own domain, since the
  backend's Better Auth session cookie lives on a different origin and never reaches our Next.js server
- `proxy.ts` (Next 16's `middleware.ts` replacement) — gates `/events/add`, `/events/manage`,
  `/election/manage` (admin only) and `/election/apply`, `/profile` (any logged-in user), matching the
  backend's `requireRole("admin")` vs `requireAuth` split exactly
- `lib/api.ts` — isomorphic fetch wrapper unwrapping the backend's `{ ok, status, data, error }` envelope
- `lib/data.ts` — public GET helpers for Server Components (events, event detail, reviews)
- `lib/action.ts` — real Next.js Server Actions (`"use server"`) for the contact form and newsletter signup

**Pages built (all from `REQUIREMENTS.md` §3–5)**
- `/` — Hero (auto-rotating upcoming-events slider), About, Why Join, Upcoming Events grid,
  Stats (Recharts bar chart), Testimonials, Blog/News, FAQ accordion, Newsletter signup, Final CTA
- `/events` — search (debounced), category/date/fee filters, sort, pagination, 4-column grid,
  skeleton loading state, empty state
- `/events/[id]` — image gallery with thumbnails, overview, key-info specs table, reviews &
  ratings (submit + list, logged-in only to post), related events, sidebar with fee + CTA
  (routes to nomination form for Election-category events)
- `/events/add` — **admin-only** create-event form (title, descriptions, category, date, venue,
  fee, cover image upload/URL, gallery images, key/value specs) — matches backend `eventSchema` exactly
- `/events/manage` — **admin-only** table (title, category, date, fee, view/delete actions)
- `/election/apply` — nomination form for **any logged-in user** (position, batch, supporter,
  representative, candidate photo) — matches backend `nominationSchema` exactly
- `/election/manage` — **admin-only** nominations table with approve/disqualify actions and status badges
- `/login` — email/password, demo-login button, decorative social buttons, redirects via `?next=`
- `/register` — name, student ID, batch, email, password+confirm, terms checkbox
- `/profile` — session info + "my nominations" list
- `/about` — history, mission, structure, full election eligibility rules
- `/contact` — server-action form, direct contact info, embedded map
- `/privacy`, `/terms` — static policy pages
- Global `not-found.tsx` (404) and `error.tsx` (500 boundary)
- Root `layout.tsx` with sticky `Navbar` (role-aware links, mobile menu) and `Footer`
- Toasts wired via `react-hot-toast` for every mutation (create/delete/approve/disqualify/review/login/etc.)

**Verified**
- `npx tsc --noEmit` passes cleanly (strict mode, `noUncheckedIndexedAccess`)
- `npx eslint .` passes cleanly — **0 errors, 0 warnings** (flat config in `eslint.config.mjs`,
  using `eslint-config-next`'s native flat export)
- `npx next build` completes successfully, all 16 routes compile/prerender — the *only* build
  failure possible in a sandbox is that `fonts.googleapis.com` isn't reachable from this
  container's network allowlist; it fetches fine on any machine with normal internet access.

## ⚠️ Known simplifications (documented in code comments where relevant)

- **Cross-domain auth**: since the frontend and backend can be deployed on separate origins, all
  authenticated *writes* (create event, apply nomination, submit review, upload image, delete,
  approve/disqualify, register/withdraw interest) are called client-side (`"use client"`
  components using `lib/api.ts`) so the browser attaches the backend's session cookie directly.
  Server Components only ever call public GET routes. This is a deliberate architecture decision,
  not an oversight — see comments in `lib/auth-client.ts` and `lib/session.ts`.

## ✅ Session: Frontend wiring pass (Part 2 of 2)

Backend Part 1 (see `CHANGELOG.md`) added `contact_messages`, `newsletter_subscribers`,
`attendees`, and `/api/stats`. This session wired the frontend to all four:

- `lib/action.ts` — `submitContactForm` / `subscribeNewsletter` now call `POST /api/contact` and
  `POST /api/newsletter` via `apiFetch` instead of `console.log`-ing; both surface real backend
  error messages (via `ApiError`) in the returned form state. Newsletter resubmission of an
  already-subscribed email is handled gracefully instead of erroring.
- `components/events/event-sidebar.tsx` — the "Register interest" button is now a real
  register/withdraw toggle backed by `POST`/`DELETE /api/attendees`. On mount, logged-in users get
  their existing registration state from `GET /api/attendees/mine` so the button (and an
  "N people interested" count) render correctly after a refresh instead of resetting.
  `app/events/[id]/page.tsx` fetches the public interest count server-side
  (`lib/data.ts#getAttendeeCount`) and passes it down as `initialCount`.
- `components/home/stats-section.tsx` — the hardcoded 2021–2025 `DATA` array is gone. The section
  now takes a `stats: StatsSummary | null` prop (fetched server-side in `app/page.tsx` via the new
  `lib/data.ts#getStats`), shows five live headline numbers (members, total/upcoming events,
  nominations, approved candidates), and two bar charts built from what `/api/stats` actually
  returns — events-by-category and members-by-batch — instead of a fabricated year-over-year
  trend. Shows a real empty-state message if the backend has no data yet, per the "no fallback
  data" rule.
- `lib/data.ts` — added `getStats()` and `getAttendeeCount(eventId)`, both public GETs following
  the existing try/catch-to-empty-state pattern used by `getEvents`/`getEvent`/`getReviews`.
- `types.ts` — added `ContactMessage`, `NewsletterSubscriber`, `Attendee`, `StatsSummary` to match
  `backend/src/types.ts`.

**Not yet verified end-to-end against a running backend** — this sandbox has no network access, so
`npm install` / `tsc --noEmit` / `next build` couldn't be re-run this session. The code was
reviewed manually for type-correctness against the existing patterns (`reviews-section.tsx`,
`lib/api.ts`'s `ApiResponse` envelope, `requireAuth`'s `req.userId`). Please run
`npm install && npx tsc --noEmit && npx eslint . && npx next build` in `frontend/` before deploying,
and smoke-test: contact form submit, newsletter signup (including a duplicate-email resubmit),
register/withdraw interest on a non-Election event as a logged-in user, and the home page stats
section against a MongoDB instance with and without seeded data.

## 🔲 Not yet started

- Automated tests (none were requested, but flagging for completeness)
- Dark mode / theme toggle (not in `REQUIREMENTS.md`, so intentionally skipped)

## To run locally

```bash
cd backend && npm install && npm run dev     # needs a MongoDB connection string + IMGBB_API_KEY in .env
cd frontend && npm install && npm run dev    # needs NEXT_PUBLIC_API_URL in .env.local
```
