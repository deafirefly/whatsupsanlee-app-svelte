# WhatsUp SanLee — Project Context

> Paste this file at the start of any new Claude session to get up to speed instantly.
> Then re-upload the ZIP (or individual files) when you need code edits.

---

## What It Is

A community web platform for **Sanford & Lee County, NC** ("SanLee = Sanford + Lee County").
Connects local food trucks, farmers, photographers, artists, and residents.
Version: **0.3.5** | Status: Active development

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via libSQL (`@libsql/client`) |
| ORM | Drizzle ORM + drizzle-kit |
| UI Components | bits-ui + shadcn-svelte style components |
| Icons | lucide-svelte |
| File Uploads | Uploadthing |
| Mobile | Capacitor (iOS & Android — in progress) |
| Testing | Playwright (e2e) |
| Deployment | Docker + CapRover (`captain-definition`) |

---

## Auth System

- **Cookie-based sessions** — no JWT library, manual cookie management
- Cookies: `user_id`, `user_email`, `user_roles` (JSON array)
- Role system: `member` → `vip` → `admin` → `superadmin`
- VIP has expiry (`vipExpiresAt`) — auto-downgraded in `hooks.server.ts`
- Auth helpers in `src/lib/utils/auth.ts` (`hasRole()`)
- `event.locals.user` = `{ id, email, roles, isAdmin }` or `null`

---

## Route Structure

```
src/routes/
├── (public)/          # No auth required
│   ├── +page          # Home — listing grid with search/filter
│   ├── login/
│   ├── register/
│   ├── feed/          # Community post feed
│   ├── events/        # Events calendar + [date] detail
│   ├── listings/[id]  # Listing detail page
│   ├── profile/[id]   # Public member profile
│   ├── [slug]/        # Vanity URL for listings
│   ├── about, contact, privacy, terms, support, subscribe, beta
│   └── maintenance/
│
├── (member)/          # Requires login
│   ├── dashboard/     # Main dashboard + sub-pages
│   │   ├── edit-listing/
│   │   ├── bookings/
│   │   └── availability/
│   ├── profile/       # Own profile view + edit
│   ├── account-settings/
│   ├── feed/create/
│   ├── events/create/
│   ├── listings/create/
│   └── settings/
│   │
│   └── (vip)/         # Requires vip/admin/superadmin role
│       ├── vip-lounge/
│       ├── vip-directory/
│       └── (admin)/   # Requires admin/superadmin role
│           ├── admin-dashboard/
│           ├── admin/logs/
│           ├── admin/review/
│           ├── admin/settings/
│           ├── areas/
│           ├── communities/
│           ├── events-admin/
│           ├── listings-admin/
│           ├── messages-admin/
│           ├── posts-admin/
│           └── users/
│
├── api/posts/[id]/comments/   # API endpoint
├── api/uploadthing/           # Uploadthing handler
└── logout/
```

---

## Database Schema (Drizzle + SQLite)

| Table | Purpose |
|---|---|
| `users` | Accounts — email, password (bcrypt), roles (JSON array), vipExpiresAt |
| `profiles` | Member profile — displayName, avatar, bio, area/community, social links, privacy, onboarding flags |
| `listings` | Business listings — name, category, contact, location, bio, image, social, schedule, booking config, status, slug |
| `listing_photos` | Multiple photos per listing (Uploadthing URLs) |
| `menu_items` | Menu items per listing (mainly food trucks) — name, price, category, image |
| `listing_schedule` | Daily location schedule — date, location, lat/lng, start/end time |
| `areas` | Lee County areas (Sanford, Tramway, Broadway, etc.) |
| `communities` | Neighborhoods within areas (e.g. Reserve at Carthage Colonies) |
| `events` | Community events — title, dates, location, area/community, status, featured |
| `posts` | Community feed posts — content, image, link, area/community, VIP-only flag |
| `post_likes` | Likes on posts |
| `post_comments` | Comments on posts |
| `post_reports` | Reports on posts |
| `bookings` | Booking requests for vendor listings |
| `availability` | Weekly availability per listing (day of week + time range) |
| `specific_availability` | One-off date availability |
| `contact_messages` | Contact form submissions |
| `logs` | System activity log (login, changes, etc.) |
| `system_meta` | Key-value store (e.g. `maintenance_mode = 'true'`) |

**Listing categories:** `food_truck` | `farmer` | `photographer` | `artist`
**Listing status:** `pending` | `approved` | `rejected`
**Profile visibility:** `public` | `members` | `private`
**Post status:** `published` | `removed`

---

## Key Components

```
src/lib/components/
├── TopBar.svelte         # Top navigation bar
├── Sidebar.svelte        # Main sidebar nav (member area)
├── MemberSidebar.svelte  # Member-specific sidebar
└── PageHeader.svelte     # Reusable page header

src/lib/components/ui/   # shadcn-style UI primitives
  badge, button, card, dialog, input, label, table
```

---

## Key Patterns

- **SvelteKit form actions** (`+page.server.ts`) for mutations (login, create, edit, delete)
- **Svelte 5 runes** — `$props()`, `$state()`, `$derived()` used throughout
- **`use:enhance`** from `$app/forms` for progressive enhancement on forms
- **`page` from `$app/state`** (Svelte 5 style, not `$app/stores`)
- Server-side auth checks in `+layout.server.ts` files per route group
- Maintenance mode via `system_meta` table, checked in `hooks.server.ts`

---

## Environment Variables

```env
UPLOADTHING_TOKEN=your_token_here
# Database: uses local.db (SQLite) by default via libSQL
```

---

## Current Status / Roadmap

**Working:**
- Auth (register, login, logout, VIP expiry)
- Listings (create, edit, admin approve/reject, vanity slugs)
- Listing photos, menu items, daily schedule
- Member profiles (edit, privacy, onboarding checklist)
- Community feed (posts, likes, comments, reports)
- Events (create, admin manage, date-based browsing)
- Bookings + availability system
- Admin panel (users, listings, posts, events, logs, areas, communities, settings)
- Maintenance mode
- Uploadthing file uploads

**In Progress / Roadmap:**
- Push notifications
- Mobile app (iOS & Android via Capacitor) — config exists, not complete
- More listing categories
- Community feed visible on dashboard (currently "Coming Soon")
