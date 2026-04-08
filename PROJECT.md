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
│   ├── +page          # Home — listing grid + farmers + upcoming yard sales + category filter
│   ├── login/
│   ├── register/
│   ├── feed/          # Community post feed
│   ├── events/        # Events calendar + [date] detail (yard sales merged in)
│   ├── listings/[id]  # Listing detail (enhanced gallery for artists/photographers)
│   ├── profile/[id]   # Public member profile
│   ├── yard-sales/    # Public yard sales listing
│   ├── yard-sales/[id] # Yard sale detail
│   ├── farmers/       # Farmers market public listing
│   ├── farmers/[id]   # Farmer detail
│   ├── family/        # Family Activities Hub (events/parks/trails tabs)
│   ├── family/parks/[id]     # Park or trail detail
│   ├── family/parks/submit   # Member submit a park/trail
│   ├── [slug]/        # Vanity URL for listings
│   ├── about, contact, privacy, terms, support, subscribe, beta
│   └── maintenance/
│
├── (member)/          # Requires login
│   ├── dashboard/     # 4 sections: Status, Profile, Community, Your Community Presence
│   │   ├── edit-listing/     # Edit listing + tags for artists/photographers
│   │   ├── bookings/
│   │   └── availability/
│   ├── profile/       # Own profile view + edit
│   ├── account-settings/
│   ├── feed/create/
│   ├── events/create/         # Includes family-friendly checkbox
│   ├── listings/create/
│   ├── yard-sales/create/
│   ├── farmers/create/
│   └── settings/
│   │
│   └── (vip)/         # Requires vip/admin/superadmin role
│       ├── vip-lounge/
│       ├── vip-directory/
│       └── (admin)/   # Requires admin/superadmin role
│           ├── admin-dashboard/      # Community Listings table card
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
│           ├── family-admin/         # Approve/reject parks & trails
│           └── users/
│
├── api/posts/[id]/comments/
├── api/uploadthing/
└── logout/
```

---

## Database Schema (Drizzle + Turso/SQLite)

| Table | Purpose |
|---|---|
| `users` | Accounts — email, password (bcrypt), roles (JSON array), vipExpiresAt |
| `profiles` | Member profile — displayName, avatar, bio, area/community, social links, privacy, onboarding flags |
| `listings` | Business listings — name, category, contact, location, bio, image, social, schedule, booking config, slug, tags (JSON), status |
| `listing_photos` | VIP gallery photos per listing (max 4) |
| `menu_items` | Menu items per listing (food trucks) |
| `listing_schedule` | Daily location schedule — date, location, lat/lng, times |
| `areas` | Lee County areas (Sanford, Tramway, Broadway, etc.) |
| `communities` | Neighborhoods within areas |
| `events` | Community events — title, dates, location, area/community, isFamilyFriendly, status |
| `posts` | Community feed posts |
| `post_likes` / `post_comments` / `post_reports` | Feed interactions |
| `bookings` | Booking requests for vendor listings |
| `availability` | Weekly availability per listing |
| `specific_availability` | One-off date availability |
| `contact_messages` | Contact form submissions |
| `logs` | System activity log |
| `system_meta` | Key-value store (e.g. maintenance_mode) |
| `yard_sales` | Yard sale listings — title, date, time, address, items (JSON), status |
| `farmer_listings` | Farm listings — produce categories, seasonal availability, markets, features, status |
| `parks_trails` | Parks/trails directory — type, age range, features (JSON), trail difficulty/length, status |

**Listing categories:** `food_truck` | `farmer` | `photographer` | `artist`
**Status pattern (all content tables):** `pending` | `approved` | `rejected`
**Profile visibility:** `public` | `members` | `private`

---

## Key Components

```
src/lib/components/
├── TopBar.svelte         # Public top navigation
├── Sidebar.svelte        # Admin sidebar (dark, role-based)
├── MemberSidebar.svelte  # Member sidebar — yard sales, farmers, family hub links
└── PageHeader.svelte     # Reusable page header
```

---

## Key Patterns

- **SvelteKit form actions** for all mutations (login, create, edit, delete)
- **Svelte 5 runes** — `$props()`, `$state()`, `$derived()` throughout
- **`use:enhance`** for progressive form enhancement
- **`page` from `$app/stores`** in Sidebar components (not `$app/state`)
- **`svelte:element`** for conditional `<a>` vs `<div>` rendering
- **Pending preview** — owners + admins can see pending listings; public gets 404
- **JSON fields** parsed with try/catch on load: `items`, `produceCategories`, `features`, `tags`
- Server-side auth checks in `+layout.server.ts` per route group
- Maintenance mode via `system_meta` table in `hooks.server.ts`

---

## Dashboard Layout (member)

4 clean sections:
1. **Status** — Total listings count, Plan (VIP/Member), Business listing status, Member since
2. **Profile** — My Profile, Edit Profile, Settings
3. **Community** — Post to Feed, Post Event, Post Yard Sale, List Your Farm + VIP Lounge link
4. **Your Community Presence** — All listings in one card (business, farms, yard sales) with status badges and action buttons

---

## Admin Dashboard

Single **Community Listings** table card with rows for:
- 🏪 Listings, 🌾 Farmers Market, 🏷️ Yard Sales, 📅 Events, 👨‍👩‍👧 Family Hub
- Columns: Type, Total, Pending (amber badge or green "Clear"), Review link
- Separate stat cards for Posts, Messages, Bookings

---

## Environment Variables

```env
# Local (.env)
TURSO_URL=libsql://whatsupsanlee-deafirefly.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=your_token_here
UPLOADTHING_TOKEN=your_uploadthing_token

# Production — set in CapRover App Configs > Environmental Variables
```

**Important:**
- `drizzle-kit` reads `.env` only — not `.env.production`
- Production token must be set in CapRover env vars — not just files
- To run with explicit env: `TURSO_URL=... TURSO_AUTH_TOKEN=... npx drizzle-kit push`
- On Windows PowerShell: `$env:TURSO_URL="..."` then `npx drizzle-kit push`

---

## Deployment Workflow

```bash
git add .
git commit -m "your message"
git push
# Then CapRover dashboard → Deploy Now
```

**Schema changes** — run SQL in Turso dashboard (app.turso.tech):
- Database → Edit Data → SQL scratches → paste → Run
- OR use `npx drizzle-kit push` with valid `.env`

**If production goes 500:**
- Check CapRover logs
- Most common: expired `TURSO_AUTH_TOKEN` in CapRover env vars
- Fix: Turso → Generate Token → update CapRover App Configs → Save & Restart

---

## Features Completed ✅

### Core Platform
- Auth (register, login, logout, VIP expiry)
- Listings (create, edit, approve/reject, vanity slugs, QR codes)
- Listing photos (VIP gallery, max 4, Uploadthing)
- Menu items + daily schedule for food trucks
- Member profiles (edit, privacy, onboarding checklist)
- Community feed (posts, likes, comments, reports)
- Events (create, admin manage, date-based browsing)
- Bookings + availability (weekly + specific dates)
- Admin panel (full — users, listings, posts, events, logs, areas, communities, settings)
- Maintenance mode

### Yard Sales ✅
- Create form with item picker, date/time, address
- Public list + detail page (`/yard-sales/[id]`)
- Merged into events page on sale day + "Yard Sales Today" collapsible
- Home page upcoming section
- Member dashboard card + admin approve/reject/feature
- Pending preview for owner + admin

### Farmer Listings ✅
- Create form: produce categories, seasonal availability, markets, features
- Special flags: U-Pick, SNAP/EBT, delivery, organic, pre-orders
- Public list (`/farmers`) with search + produce filter
- Detail page with directions
- Home page grid with green theme + produce tags
- Member dashboard card + admin approve/reject/feature
- Pending preview for owner + admin

### Artist & Photographer Galleries ✅
- `tags` column on listings (JSON)
- Tags input in edit-listing with suggestion chips
- Enhanced listing detail: masonry gallery, fullscreen lightbox, tags badges
- "Book a Session" language for creatives
- VIP photo limit respected (max 4 gallery photos)

### Family Activities Hub ✅
- `/family` public page with Events / Parks / Trails tabs
- `isFamilyFriendly` flag on events + checkbox on event create form
- `parks_trails` table — parks, playgrounds, trails, sports fields, swimming, picnic
- Detail page with features, trail info, directions
- Member submission form (`/family/parks/submit`)
- Admin approve/reject/feature/delete (`/family-admin`)
- Pending preview for owner + admin
- Family Hub links in MemberSidebar + admin Sidebar + admin dashboard table

### Home Page ✅
- Farmers merged into main grid alongside listings
- Category filter buttons: All 🌟, Food Trucks 🚚, Farmers 🌾, Photographers 📸, Artists 🎨
- Unified search across names, bios, produce categories
- Upcoming Yard Sales section below grid

---

## Roadmap

1. 📱 **Local Digital Creators Directory** — TikTok, YouTube, Instagram, podcasts. Needs: `creators` table, public directory, admin approval.

2. 🔔 **Push Notifications** — web push for events, yard sales, posts. Needs: service worker, `push_subscriptions` table, VAPID keys, `web-push` npm package.

3. 📱 **Mobile App** — iOS & Android via Capacitor (config exists). Needs Mac for iOS. Apple Dev $99/yr, Google Play $25 one-time.

4. 🔐 **Social Login** — Google, Facebook via OAuth.

5. 📧 **Email Notifications** — booking confirmations, event reminders, approval notices.
