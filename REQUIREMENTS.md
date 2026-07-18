# Netrokona University Computer Club — Project Requirements

A production-ready full-stack TypeScript web application for the Computer
Club, Department of CSE, Netrokona University.

> This is the original requirements doc, kept verbatim as the source of
> truth. `CHANGELOG.md` tracks decisions/clarifications made *on top of*
> this (e.g. final auth architecture, image storage choice, roles).

## 1. Technology Stack

### Frontend
- Next.js 16 version
- TypeScript (mandatory, strict mode)
- Tailwind CSS
- Recharts (for stats/analytics visuals)
- Better Auth (for login and registration/join club)

### Backend
- Express.js
- TypeScript (mandatory)
- MongoDB (not use Mongoose)
- JWT-based authentication
- jose to create JWT

Run everything on the latest versions — no old versions. Always think about
how to make the project perform better and how to reduce time complexity.
Show a loader when data takes time to load. Use smooth scroll animation
(latest version of Motion). Follow the latest Next.js docs for
theming/SSR. This is a learning project, so code should be shown. If a new
tech is needed, ask first which related tech the requester already knows,
suggest options, then proceed.

### Other
- Google Fonts (Saira Stencil One, Vidaloka, Rokkitt, Inter) — server-side rendered
- Lucide React (icons)
- react-hot-toast for success/error notifications

## 2. Design System (finalized) — "Circuit Teal"

| Role | Hex | Usage |
|---|---|---|
| Primary | `#0D3B3B` | Navbar, hero, footer, headings |
| Secondary | `#14B8A6` | Links, icons, highlights |
| Accent | `#F4A340` | Primary CTA buttons, badges |
| Neutral | `#FAF9F6` bg / `#4C7E78` text | Backgrounds, muted text |

### Typography
| Role | Font |
|---|---|
| Logo / club name | Saira Stencil One |
| H1 / H2 headings | Vidaloka |
| Sub-headings / card titles | Rokkitt (weight 500) |
| Body text | Inter |

### Component rules
- Card radius: 12px, uniform size across a grid, 4 cards/row on desktop
- Buttons: amber fill = primary CTA, teal outline = secondary
- Spacing scale: 0.5 / 1 / 1.5 / 2rem
- Skeleton loaders for async card grids
- Fully responsive: mobile, tablet, desktop breakpoints

## 3. Site Structure & Pages

### 3.1 Home (`/`)
- Sticky navbar — logged out: Home, Events, About, Contact + Join club CTA;
  logged in: + Add event (general user), Manage events (admin), Profile
- Hero (60–70vh): tagline, upcoming-event slider, dual CTA
- Sections (8): About the club, Why join, Upcoming events, Club statistics,
  Testimonials, Blog/news, FAQ, Newsletter, final CTA
- Fully functional footer: explore links, account links, contact info, social links

### 3.2 Events listing (`/events`)
- Search bar (by name)
- Filters: Category (Contest / Fest / Workshop / Sports / Seminar / Social /
  Election) + Date range + Fee — minimum 2 filter fields met
- Sort: date
- Pagination (page numbers)
- Card grid: 4/row desktop, skeleton loader on load
- 12 real events seeded (see §5)

### 3.3 Event details (`/events/[id]`) — public
- Image gallery (multiple visuals)
- Overview / description
- Key info / specifications (date, time, venue, fee)
- Reviews / ratings
- Related events
- Sidebar: fee, CTA to register/apply

### 3.4 Authentication
- `/login` — email + password, validation, demo-login button, social login
  buttons (Google/Facebook — optional/decorative), link to register
- `/register` — full name, student ID, batch/year, email, password +
  confirm, terms checkbox, validation

### 3.5 Protected: Add item (`/events/add` or `/election/apply`) — admin
- Redirect to `/login` if not authenticated
- Fields: Title, short description, full description, category, date,
  priority/position, fee, optional image URL, file upload
- Submit / Cancel actions

### 3.6 Protected: Manage items (`/events/manage` or `/election/manage`) — admin
- Role-based: normal member vs Election Commission/admin
- Table: name/title, category, batch, fee, status (pending/approved/disqualified),
  actions (view, delete/approve)
- Clean, responsive table layout

### 3.7 Additional pages
- `/about` — club story, budget transparency, election commission leadership
- `/contact` — contact form + direct contact info + map placeholder — real address
- `/privacy`, `/terms` — footer-linked policy pages

## 4. Special Module: Executive Committee Election 2026

Sourced from the official NEUCC election notice (Serial No.
NEU-CSECC/EC/2026/001). Integrated as an event within the Events module
rather than a separate nav item.

- Election date: 23 July 2026, 10:00 AM–4:00 PM, CSE Dept Lab-B, secret ballot
- Timeline: Nomination (14–16 Jul) → Candidate list (16 Jul) → Appeal
  (19 Jul) → Symbol allocation (19 Jul) → Campaign (19–21 Jul) → Election
  day (23 Jul)
- 19 positions across 4 year groups (Final/Third/Second/First year) with
  fees ৳100–৳500
- Eligibility rules: enrolled B.Sc. CSE student, 6+ months club involvement,
  one position per candidate, political-neutrality clause, constitution
  acknowledgment; Programming Secretary requires IUPC/ICPC experience
- Apply page reuses the protected "Add item" pattern (nomination form:
  name, student ID, batch, position, supporter/representative endorsement,
  photo upload, constitution agreement)
- Manage page reuses the protected "Manage items" pattern, restricted to
  Election Commission role (approve/disqualify candidates)

## 5. Seed Content — Events (no placeholders)

1. Regional Programming Contest 2025 — Contest — 15 Oct — ৳300/team
2. Intra University Programming Contest — Contest — 5 Sep — Free
3. CSE Fest 2025 — Fest — 20–21 Nov — ৳150
4. IT Quiz Competition — Contest — 20 Nov — Free
5. Project Showcasing 2025 — Fest — 21 Nov — Free entry
6. PC Building & Troubleshooting Workshop — Workshop — 12 Oct — ৳100
7. Web Development Bootcamp — Workshop — 3 Dec — ৳200
8. Freshers' Reception 2025 — Social — 25 Aug — Free
9. Inter-Batch Football Tournament — Sports — 8–10 Nov — ৳400/team
10. Inter-Batch Cricket Tournament — Sports — 15–17 Nov — ৳300/team
11. Badminton Championship — Sports — 22 Nov — ৳100
12. Executive Committee Election 2026 — Election — 23 Jul 2026 — ৳100–৳500 (see §4)
13. (optional 13th item) Career Guidance Seminar — Seminar — 28 Sep — Free

> Superseded by a later decision in `CHANGELOG.md`: **no seed data** is
> actually being inserted — empty states show a real message + CTA instead.
> This list stays here as reference content for when real events get added
> through the UI.

## 6. Data Models (MongoDB)

### User
`name, studentId, batch (enum: 1st–4th year), email, passwordHash, role (enum: member | election_commission | admin), createdAt`

> Superseded: roles simplified to `user | admin` only (see CHANGELOG).

### Event
`title, shortDescription, fullDescription, category (enum), date, venue, fee, imageUrl, images[], specs (key-value), createdBy, createdAt`

### Nomination (election-specific)
`candidateId (ref User), position, batchYear, supporterName, supporterId, representativeName, representativeId, photoUrl, status (pending|approved|disqualified), appliedAt`

### Review
`eventId (ref Event), userId (ref User), rating (1-5), comment, createdAt`

## 7. Non-functional requirements

- No placeholder/lorem ipsum content anywhere
- Consistent card size, radius, spacing across all listings
- Fully responsive (mobile/tablet/desktop) on every page
- Role-based route protection (JWT middleware) for `/events/add`,
  `/events/manage`, election apply/manage routes
- All buttons and links functional (no dead links)
- Skeleton loading states for async data fetches

## 8. Build order (suggested)

1. Next.js + TypeScript scaffold, Tailwind config with design tokens
2. MongoDB models + connection
3. Auth API (register, login, JWT middleware) + `/login`, `/register` UI
4. Events API (CRUD) + `/events`, `/events/[id]` UI
5. Protected add/manage routes + role middleware
6. Election module (nomination + admin approval)
7. Home page sections + About/Contact/Privacy/Terms
8. QA pass: responsiveness, broken links, skeleton loaders, empty states

## Additional notes from the original brief (freeform)

- Run everything on latest tech; show docs/terminal commands so this is a
  learning project too.
- Wherever data needs to load from the database, show a meaningful empty
  state + CTA first — never fallback/demo data.
- Shared types live in `types.ts` (frontend and backend each keep their own,
  kept in sync); server actions live in `lib/action.ts` on the frontend.
- Better Auth must be used on the frontend side too (client wiring).
- `proxy.ts` (not `middleware.ts` — deprecated in Next.js 16) handles
  frontend role-based access.
- Next.js version target: 16.2.10 (LTS, current as of July 2026).
- No seed data required — empty pages should show meaningful text + CTA
  instead.
- Roles: `user` (general CSE dept. student) and `admin` only.
- Cover error states: 404, 202, 201, 500, etc. wherever relevant.
- Every nav tab/button must be functional — nothing dead or empty.
- The election module/tab must be fully working end-to-end.

---

## Decisions made on top of this doc (see `CHANGELOG.md` for full log)

- **Auth**: Better Auth runs on the Express backend (source of truth for
  register/login/password hashing); its JWT plugin (jose-based) issues
  tokens that `proxy.ts` on the frontend verifies for role-based route
  gating.
- **Payment**: no payment gateway or balance/transaction model — `fee` is a
  display-only field on the Event document.
- **Image storage**: ImgBB (free API) — backend proxies the upload so the
  API key never reaches the browser.
- **Deployment target**: Vercel (frontend) + Railway/Render (backend) +
  MongoDB Atlas.
- **First admin account**: no seed script — register normally, then flip
  the `role` field to `"admin"` manually in MongoDB Atlas/Compass.
- **Open question**: frontend and backend on fully separate domains means
  Better Auth cookies need `sameSite: "none"`, `secure: true`, and
  `trustedOrigins` set correctly — same rule applies even in local dev
  (`localhost:3000` vs `localhost:5000`).
