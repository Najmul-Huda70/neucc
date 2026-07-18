# NEUCC Backend

Express + TypeScript + MongoDB (native driver) + Better Auth.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGODB_URI, BETTER_AUTH_SECRET, IMGBB_API_KEY
npm run dev
```

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

## Creating the first admin

No seed script by design. Register normally through `/register` on the
frontend, then in MongoDB Atlas (or Compass), open the `user` collection
and change that user's `role` field from `"user"` to `"admin"`.

## Folder structure

```
src/
  index.ts           # Express app entry
  db.ts              # MongoDB connection (native driver)
  types.ts           # shared type definitions
  lib/
    auth.ts          # Better Auth instance (MongoDB adapter + JWT plugin)
  middleware/
    requireRole.ts   # role-gate for protected routes
  routes/
    events.ts        # events CRUD + search/filter/sort/paginate
    nominations.ts   # election candidate applications + approve/disqualify
    reviews.ts       # one review per user per event, with aggregate rating
    upload.ts        # ImgBB upload proxy (key stays server-side)
```

## API reference

All responses use the `ApiResponse<T>` envelope: `{ ok, status, data?, error? }`.

### Events — `/api/events`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | public | `search`, `category`, `dateFrom`, `dateTo`, `feeType` (free/paid), `sort` (date/fee-asc/fee-desc), `page`, `limit` |
| GET | `/:id` | public | 404 if not found |
| POST | `/` | admin | body validated against the Event shape |
| PATCH | `/:id` | admin | partial update |
| DELETE | `/:id` | admin | |

### Nominations — `/api/nominations` (Election module)
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | logged in | one active (non-disqualified) nomination per user per election event |
| GET | `/mine` | logged in | the caller's own nominations |
| GET | `/` | admin | optional `eventId`, `status` filters |
| PATCH | `/:id/status` | admin | `{ status: "pending" \| "approved" \| "disqualified" }` |
| DELETE | `/:id` | owner (while pending) or admin | withdraw / remove |

### Reviews — `/api/reviews`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/event/:eventId` | public | returns `{ items, average, count }` |
| POST | `/` | logged in | upserts — one review per user per event |
| DELETE | `/:id` | owner or admin | |

### Upload — `/api/upload`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | logged in | body `{ image: "<base64 or data URL>" }` → `{ url }` via ImgBB. Requires `IMGBB_API_KEY`. |

### Contact — `/api/contact`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | public | `{ name, email, message }` — real persistence, replaces the old `console.log` stub |
| GET | `/` | admin | list submitted messages, newest first |

### Newsletter — `/api/newsletter`
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | public | `{ email }` — deduped, returns `{ alreadySubscribed: true }` on repeat |
| GET | `/` | admin | `{ items, count }` |

### Attendees — `/api/attendees` (non-Election "Register interest")
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/` | logged in | `{ eventId }` — one record per user per event, 201 first time / 200 if already registered |
| DELETE | `/:eventId` | logged in | withdraw interest |
| GET | `/count?eventId=` | public | `{ count }` — powers "N people interested" |
| GET | `/mine` | logged in | `{ eventIds: string[] }` — so the button renders correctly after a refresh |

### Stats — `/api/stats`
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | public | live aggregates only (see `StatsSummary` in `types.ts`) — total members/events/upcoming/nominations, events-by-category, members-by-batch. No fabricated multi-year history, since we don't have snapshots to report. |

## Status

- [x] Express app, CORS, helmet, rate limiting
- [x] MongoDB connection helper
- [x] Better Auth wired up (email/password + JWT plugin)
- [x] Events CRUD (list/search/filter/sort/paginate, get one, create, update, delete — admin-gated)
- [x] Nominations routes (apply, list mine, admin list/filter, approve/disqualify, withdraw/delete)
- [x] Reviews routes (list by event with average rating, upsert, delete)
- [x] ImgBB upload proxy route
- [x] Contact messages (real persistence, admin-readable)
- [x] Newsletter subscribers (deduped, admin-readable)
- [x] Attendees / "register interest" for non-Election events
- [x] Real stats endpoint (replaces the frontend's fabricated chart data)
- [ ] **Part 2 (frontend, not started yet):** wire `lib/action.ts` to `/api/contact` + `/api/newsletter`
      instead of `console.log`; wire `event-sidebar.tsx`'s "Register interest" to `/api/attendees`;
      replace `stats-section.tsx`'s hardcoded 2021–2025 data with a live `/api/stats` fetch
