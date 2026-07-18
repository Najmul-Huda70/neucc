# Project Changelog / Decision Log

Keep this updated every session — if the chat ever gets cut off, this file
is the source of truth for what's decided and what's next.

> The full original requirements brief now lives in `REQUIREMENTS.md`
> (verbatim, with "superseded by" notes pointing here where a decision
> changed something). Read that first if you're picking this project back
> up cold.


## Session: Recheck + priority field

Full manual recheck of the project (no network access this session either, so
still no `npm install`/build verification — see `FRONTEND_PROGRESS.md`).
Found two gaps against `REQUIREMENTS.md` and resolved both:

- **"Add event" access** — §3.1's navbar text ("Add event (general user)")
  contradicted §3.5 ("Protected: Add item … — admin"). Confirmed: **admin-only**
  is correct and final. `proxy.ts`, `requireRole("admin")` on
  `POST /api/events`, and the navbar were already consistent with this — no
  code change needed, just recording the decision here so it's not flagged
  again as an open contradiction.
- **Missing "priority/position" field** — §3.5 lists this as an Add-event
  field; it was missing from `eventSchema` and `AddEventForm`. Added:
  - `backend/src/routes/events.ts` — `eventSchema.priority`
    (`z.number().int().min(0).max(999).default(0)`); higher number = shown
    first. Default GET `/api/events` sort (`date`) now sorts by
    `{ priority: -1, date: 1 }` so pinned/flagship events (e.g. the Election)
    surface first within the same date range; added an explicit `priority`
    sort option too.
  - `backend/src/types.ts` / `frontend/src/types.ts` — `EventDoc.priority: number`
  - `frontend/src/components/events/add-event-form.tsx` — new Priority number
    input next to Fee, included in the `POST /api/events` body
  - `frontend/src/components/events/events-manage-table.tsx` — new Priority
    column so admins can see it at a glance
  - `frontend/src/components/home/hero.tsx` needed no change — it just
    consumes `getEvents({ sort: "date" })`, so it automatically benefits from
    the new priority-first ordering

## Session: Admin messages view + event edit form

- **`/admin/messages`** (admin-only, gated via `proxy.ts` + backend `requireRole("admin")`
  on the existing `GET /api/contact` / `GET /api/newsletter`) — tabbed page showing submitted
  contact messages and newsletter subscribers. New components:
  `components/admin/contact-messages-table.tsx`, `components/admin/newsletter-subscribers-table.tsx`.
  Added a "Messages" link to the navbar (desktop + mobile) for admins.
- **`/events/[id]/edit`** (admin-only) — `components/events/add-event-form.tsx` now takes an
  optional `event` prop: when present it pre-fills every field and submits `PATCH /api/events/:id`
  instead of `POST /api/events`. `events-manage-table.tsx` got a new pencil/Edit action next to
  View and Delete. `proxy.ts`'s prefix-based route gate couldn't express a dynamic `/events/:id/edit`
  path, so it now also checks a small regex (`EVENT_EDIT_RE`) alongside the existing `ADMIN_ONLY`
  prefix list.

Still not verified against a real `npm install`/build — no network access in this sandbox. Manually
checked brace/paren balance and cross-referenced every new call against the actual backend route
signatures (`PATCH /api/events/:id` response shape, `GET /api/contact` / `GET /api/newsletter`
envelopes) before considering this done.

## Decisions locked in
- Stack: Next.js 16.2.10 LTS + Express (2-folder monorepo) + MongoDB native driver (no Mongoose)
- Auth: Better Auth on the Express backend (source of truth), JWT plugin (jose) for `proxy.ts` role checks on the frontend
- Roles: `user`, `admin` only
- No payment/balance system — fee is a display-only field
- Image storage: ImgBB (backend proxies upload, key stays server-side)
- Deployment target: Vercel (frontend) + Railway/Render (backend) + MongoDB Atlas
- First admin: manual role flip in MongoDB Atlas/Compass, no seed script
- No placeholder/seed content anywhere — empty states must show a real message + CTA
- Design system: Circuit Teal palette, Saira Stencil One / Vidaloka / Rokkitt / Inter fonts (see `frontend-design-system.md` if present)
- Election module lives inside Events (category: "Election"), not a separate nav item

## Done
- [x] Backend scaffold: Express + TS config, MongoDB connection, Better Auth + JWT plugin, role middleware, Events CRUD routes, health check, error/404 handling
- [x] Events: added `dateFrom`/`dateTo` + `feeType` filters (spec needs 2+ filter fields beyond category) and a PATCH route for admin edits
- [x] `requireAuth` middleware — for routes that need "any logged-in user", separate from `requireRole` (admin-only)
- [x] Nominations routes: apply (one active nomination per user per election event), `/mine`, admin list with filters, approve/disqualify, owner-withdraw-while-pending
- [x] Reviews routes: list by event (with average rating + count), upsert (one review per user per event), delete (owner or admin)
- [x] ImgBB upload proxy route (`/api/upload`) — key stays server-side, strips data-URL prefix, forwards via native `fetch`/`FormData`
- [x] Backend typechecks clean (`npx tsc --noEmit`) and boots (verified it reaches the Mongo connection attempt with no module/syntax errors)

## Next up
- [ ] Frontend scaffold: Next.js 16 app, Tailwind, globals.css (multi-palette), fonts, layout.tsx (SSR theme via cookies)
- [ ] proxy.ts (JWT verification, role-based route gating)
- [ ] Better Auth client wiring on frontend
- [ ] Pages: Home, /events, /events/[id], /login, /register, /events/add, /events/manage, /about, /contact
- [ ] lib/action.ts (server actions) + frontend/types.ts

## Open questions (unresolved)
- Same-domain subdomains for frontend/backend in production, or fully separate domains? Affects cookie `sameSite` config.

## Session: Backend completion pass (Part 1 of 2)

Read `FRONTEND_PROGRESS.md`, found 4 documented incompletenesses. Split the
fix into two parts:

### ✅ Part 1 — Backend (done this session)
- Added `contact_messages` collection + `POST/GET /api/contact`
- Added `newsletter_subscribers` collection + `POST/GET /api/newsletter` (deduped by email)
- Added `attendees` collection + `POST/DELETE /api/attendees`, `GET /api/attendees/count`, `GET /api/attendees/mine`
- Added `GET /api/stats` — real aggregates (totalMembers, totalEvents, upcomingEvents,
  totalNominations, approvedNominations, eventsByCategory, membersByBatch) computed
  live from MongoDB. No fabricated year-by-year history.
- New types added to `backend/src/types.ts`: `ContactMessage`, `NewsletterSubscriber`,
  `Attendee`, `StatsSummary`
- All four new routers wired into `index.ts`
- `backend/README.md` updated with full API reference + status checklist

**Not yet run against a real MongoDB instance / not yet `npm install`-ed in this
sandbox** (no network access here) — please run `npm install` and smoke-test
each new route locally before wiring the frontend to them.

### ✅ Part 2 — Frontend wiring (done this session)
- `frontend/src/lib/action.ts` — `submitContactForm` / `subscribeNewsletter` now call
  `POST /api/contact` and `POST /api/newsletter` via `apiFetch` (real success/error states,
  including a friendly path for "already subscribed")
- `frontend/src/components/events/event-sidebar.tsx` — "Register interest" is now a real
  register/withdraw toggle via `POST`/`DELETE /api/attendees`, hydrated from
  `GET /api/attendees/mine`; shows a live "N people interested" count
- `frontend/src/components/home/stats-section.tsx` — hardcoded `DATA` array removed; now driven
  by `GET /api/stats` (headline numbers + events-by-category / members-by-batch bar charts),
  with a real empty state when there's no data yet
- `frontend/src/lib/data.ts` — added `getStats()` and `getAttendeeCount(eventId)`
- `frontend/src/types.ts` — added `ContactMessage`, `NewsletterSubscriber`, `Attendee`,
  `StatsSummary` to match the backend

**Not re-verified against a running backend / MongoDB** — sandbox has no network access this
session either, so no `npm install`. See `FRONTEND_PROGRESS.md` for the exact commands and smoke
tests to run before deploying.

### 🔲 Next up
- Run `npm install && npx tsc --noEmit && npx eslint . && npx next build` in both `frontend/` and
  `backend/` against real network access, fix anything that surfaces
- Smoke-test every new route against a real MongoDB instance
- Optional: admin UI pages for `GET /api/contact` and `GET /api/newsletter` (backend routes exist,
  no frontend page consumes them yet)
