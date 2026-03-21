# WhatsUp SanLee 🌟

A community web app for **Sanford and Lee County, NC** — connecting local food trucks, farmers, photographers, artists, and residents in one place.

## About

WhatsUp SanLee is a full-stack community platform built for the people of Lee County, North Carolina. Whether you're a local food truck owner wanting to share your daily location, a resident looking to discover local talent, or a community member wanting to connect with your neighborhood — WhatsUp SanLee has you covered.

## Features

### 🏪 Community Listings
- Browse local food trucks, farmers, photographers, and artists
- View detailed profiles with menus, photos, schedules, and daily map locations
- Search and filter by category
- Submit your own listing for admin approval

### 👤 Member Profiles
- Create a personal profile with bio, avatar, and social links
- Select your Lee County area and neighborhood community
- Control your privacy (public, members only, or private)
- View other members' public profiles

### 🗺️ Daily Location Tracking
- Food trucks can post their daily locations with map pins
- Upcoming schedule with dates, times, and locations
- Direct Google Maps integration for directions

### ⭐ VIP Membership
- Tiered access system (Member, VIP, Admin, SuperAdmin)
- Exclusive VIP Lounge for premium members
- Upgrade to VIP for exclusive content

### 🛠️ Admin Panel
- Approve, reject, or delete listing submissions
- Manage users and roles
- Manage Lee County areas and neighborhood communities
- System logs and database management

## Tech Stack

- **Frontend** — [SvelteKit](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/) + TypeScript
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com/)
- **Database** — SQLite via [libSQL](https://github.com/tursodatabase/libsql)
- **ORM** — [Drizzle ORM](https://orm.drizzle.team/) + drizzle-kit
- **File Uploads** — [Uploadthing](https://uploadthing.com/)
- **Mobile** — [Capacitor](https://capacitorjs.com/) (iOS & Android)
- **UI Components** — [bits-ui](https://bits-ui.com/)
- **Icons** — [Lucide Svelte](https://lucide.dev/)
- **Testing** — [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/deafirefly/whatsupsanlee-app-svelte.git
cd whatsupsanlee-app-svelte

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your UPLOADTHING_TOKEN to .env

# Run database migrations
npx drizzle-kit push

# Seed the database (optional)
pnpm db:seed

# Start the development server
pnpm dev
```

### Environment Variables
```env
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

## Project Structure
```
src/
├── lib/
│   ├── components/      # Shared components (Sidebar, TopBar, etc.)
│   └── server/
│       └── db/          # Drizzle schema and database connection
├── routes/
│   ├── (admin)/         # Admin-only pages
│   ├── (member)/        # Authenticated member pages
│   │   ├── (vip)/       # VIP & Admin pages
│   │   ├── dashboard/   # Member dashboard
│   │   ├── profile/     # Member profile pages
│   │   └── listings/    # Listing management
│   └── (public)/        # Public pages (home, listings, login, etc.)
└── app.css              # Global styles
```

## Database Schema

- `users` — member accounts and roles
- `listings` — community business listings
- `listing_photos` — multiple photos per listing
- `menu_items` — menu items for food trucks
- `listing_schedule` — daily location schedule
- `profiles` — member profile data
- `areas` — Lee County areas (Sanford, Tramway, Broadway, etc.)
- `communities` — neighborhoods within each area
- `logs` — system activity logs

## Roadmap

- [ ] Community feed / posts
- [ ] Events calendar
- [ ] Push notifications
- [ ] Mobile app (iOS & Android via Capacitor)
- [ ] More listing categories

## About the Name

**SanLee** = **San**ford + **Lee** County, NC 🌟

## License

Private project. All rights reserved.