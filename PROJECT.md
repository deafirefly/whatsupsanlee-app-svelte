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
| Database | Turso (libSQL / SQLite) via `@libsql/client` |
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
│   ├── +page          # Home — listing grid + upcoming yard sales
│   ├── login/
│   ├── register/
│   ├── feed/          # Community post feed (includes yard sales)
│   ├── events/        # Events calendar + [date] detail (yard sales merged in)
│   ├── listings/[id]  # Listing detail page
│   ├── profile/[id]   # Public member profile
│   ├── yard-sales/    # Public yard sales listing page
│   ├── yard-sales/[id] # Yard sale detail page
│   ├── farmers/       # Public farmers market listing page
│   ├── farmers/[id]   # Farmer detail page
│   ├── [slug]/        # Vanity URL for listings
│   ├── about, contact, privacy, terms, support, subscribe, beta
│   └── maintenance/
│
├── (member)/          # Requires login
│   ├── dashboard/     # Main dashboard (4 sections: Status, Profile, Community, Presence)
│   │   ├── edit-listing/
│   │   ├── bookings/
│   │   └── availability/
│   ├── profile/       # Own profile view + edit
│   ├── account-settings/
│   ├── feed/create/
│   ├── events/create/
│   ├── listings/create/
│   ├── yard-sales/create/   # Submit a yard sale (pending approval)
│   ├── farmers/create/      # Submit a farmer listing (pending approval)
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
│           ├── yard-sales-admin/
│           ├── farmers-admin/
│           └── users/
│
├── api/posts/[id]/comments/   # API endpoint
├── api/uploadthing/           # Uploadthing handler
└── logout/
```

---

## Database Schema (Drizzle + Turso/SQLite)

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
| `yard_sales` | Member yard sale listings — title, date, time range, address, items (JSON array), status |
| `farmer_listings` | Farm listings — farm name, produce categories, seasonal availability, markets attended, special features (U-Pick, SNAP/EBT, delivery, organic, pre-orders), contact/social, status |

**Listing categories:** `food_truck` | `farmer` | `photographer` | `artist`
**Listing/Event/Yard Sale/Farmer status:** `pending` | `approved` | `rejected`
**Profile visibility:** `public` | `members` | `private`
**Post status:** `published` | `removed`

---

## Key Components

```
src/lib/components/
├── TopBar.svelte         # Top navigation bar
├── Sidebar.svelte        # Admin sidebar (dark theme, role-based sections)
├── MemberSidebar.svelte  # Member sidebar (light, includes yard sales + farmers links)
└── PageHeader.svelte     # Reusable page header

src/lib/components/ui/   # shadcn-style UI primitives
  badge, button, card, dialog, input, label, table
```

---

## Key Patterns

- **SvelteKit form actions** (`+page.server.ts`) for mutations (login, create, edit, delete)
- **Svelte 5 runes** — `$props()`, `$state()`, `$derived()` used throughout
- **`use:enhance`** from `$app/forms` for progressive enhancement on forms
- **`page` from `$app/stores`** — Sidebar components use `$app/stores` not `$app/state`
- Server-side auth checks in `+layout.server.ts` files per route group
- Maintenance mode via `system_meta` table, checked in `hooks.server.ts`
- Items/tags stored as JSON strings in SQLite, parsed on load
- **Pending listings** — owners and admins can preview pending/rejected listings; public sees 404
- **`svelte:element`** used for conditionally rendering `<a>` vs `<div>` cards (e.g. yard sales in events list)

---

## Dashboard Layout (member)

The dashboard is divided into 4 clean sections:
1. **Status** — Total listings, Plan (VIP/Member), Business listing status, Member since
2. **Profile** — My Profile, Edit Profile, Settings
3. **Community** — Post to Feed, Post Event, Post Yard Sale, List Your Farm + VIP Lounge link
4. **Your Community Presence** — All listings in one place:
   - Business listing (with Edit/View/Bookings buttons)
   - Farm listings (with View button + status)
   - Yard sales (with View button + status)
   - Each shows dashed "create" prompt when empty

---

## Environment Variables

```env
# Local (.env)
TURSO_URL=libsql://whatsupsanlee-deafirefly.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=your_token_here
UPLOADTHING_TOKEN=your_uploadthing_token

# Production — set in CapRover App Configs > Environmental Variables
# Same keys as above — CapRover env vars override everything
```

**Important notes:**
- `drizzle-kit` reads `.env` only — not `.env.production`
- Set `TURSO_URL` + `TURSO_AUTH_TOKEN` in `.env` to push schema changes to Turso
- Production token must also be set in **CapRover env vars** — not just the file

---

## Deployment Workflow

```bash
# Commit and push to GitHub
git add .
git commit -m "your message"
git push

# Deploy via CapRover dashboard → your app → Deployment tab → Deploy Now
# Or via CLI:
caprover deploy -default
```

**Schema changes** — run SQL directly in Turso dashboard (app.turso.tech):
- Go to database → Edit Data → SQL scratches → paste SQL → Run
- `drizzle-kit push` also works if `.env` has valid Turso credentials

**If production goes down (500 error):**
- Check CapRover logs for the error message
- Most common cause: expired `TURSO_AUTH_TOKEN` in CapRover env vars
- Fix: Turso dashboard → Generate Token → update in CapRover App Configs → Save & Restart

---

## Current Status

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
- **Yard Sales** ✅ fully complete
  - Create form with item picker, date/time, address, Google Maps link
  - Public list page (`/yard-sales`) with upcoming + past sections
  - Individual detail page (`/yard-sales/[id]`) with full info + share + delete
  - Merged into events page on sale day (also in collapsible "Yard Sales Today" section)
  - Preview cards in community feed
  - Member dashboard shows own yard sales + status
  - Admin approve/reject/feature + pending count on admin dashboard
  - Nav links in both MemberSidebar and admin Sidebar
- **Farmer Listings** ✅ fully complete
  - Create form with produce categories, seasonal availability, markets attended
  - Special features: U-Pick, SNAP/EBT, delivery, organic, pre-orders
  - Public list page (`/farmers`) with search + produce filter
  - Individual detail page (`/farmers/[id]`) with full info + directions + delete
  - Member dashboard shows own farm listings + status
  - Admin approve/reject/feature/delete + pending count on admin dashboard
  - Nav links in both MemberSidebar and admin Sidebar
  - Owners + admins can preview pending listings (public sees 404)

---

## Roadmap

1. 🎨 **Artist & Photographer Galleries** — enhanced listing profiles with photo gallery of their work. Needs: gallery UI on listing detail page, Uploadthing multi-upload. (`listing_photos` table already exists)

2. 👨‍👩‍👧 **Family Activities Hub** — curated section for families with kids. Movies, parks, hiking trails, playgrounds, kid-friendly events. Could be filtered view of events + dedicated trails/parks directory.

3. 📱 **Local Digital Creators Directory** — profiles for local social media creators (YouTube, TikTok, Instagram, Twitch, podcast). Needs: `creators` table, public directory, admin approval.

4. 🔔 **Push Notifications** — web push for new yard sales, events, posts. Needs: service worker, `push_subscriptions` table, VAPID keys, `web-push` npm package.

5. 📱 **Mobile App** — iOS & Android via Capacitor (config exists, not wired up). Needs Mac for iOS build. Apple Developer account ($99/yr) for App Store. Google Play ($25 one-time).
