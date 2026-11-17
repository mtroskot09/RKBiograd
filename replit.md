# RK Biograd Handball Club Website

## Overview

This is a full-stack web application for RK Biograd, a Croatian handball club based in Biograd na Moru. The website serves as the official digital presence for the club, providing news updates, match fixtures, league standings, and information about different team categories (senior team, U15, U13). The platform features a public-facing website for fans and members, plus an admin dashboard for content management.

The application is built as a modern single-page application (SPA) with server-side API endpoints, designed to showcase team achievements, engage with the community, and provide easy access to club information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)
- Path aliases configured for clean imports (`@/` for client code, `@shared/` for shared types)

**UI Component System:**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, accordions, etc.)
- shadcn/ui design system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Custom CSS variables for theming (light/dark mode support)
- Design follows sports community platform principles with bold, energetic aesthetics inspired by professional handball club websites

**State Management & Data Fetching:**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom query client configured with specific error handling and refetch behavior
- No global client state management library (uses React context where needed)

**Authentication UI:**
- Auth state managed through custom `useAuth` hook
- Conditional rendering of admin features based on authentication status
- Session-based authentication with visual feedback in header component

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe server code
- RESTful API design pattern with `/api/*` endpoints
- Middleware pipeline for request logging, JSON parsing, and error handling

**Authentication & Authorization:**
- Google sign-in via OpenID Connect (`openid-client` + Passport), see `server/auth.ts`
- Only Google accounts listed in `ADMIN_EMAILS` get admin access (checked at login and on every admin request)
- Session management with PostgreSQL-backed session store (`connect-pg-simple`), sessions last 7 days
- Protected routes using `isAuthenticated` middleware
- Local development without `GOOGLE_CLIENT_ID`: login disabled, every request is a local admin (refused in production)

**Database Layer:**
- Drizzle ORM for type-safe database operations
- PostgreSQL (Render, Neon or local) via the standard `pg` driver (`server/db.ts`)
- Schema-first approach with Zod validation integration
- Schema changes applied with `npm run db:push` (Drizzle Kit)

**Data Models (stored in Postgres):**
- Users (admins who signed in with Google): id, email, firstName, lastName, profileImageUrl
- Posts: news articles with categories, image, timestamps
- Staff assignments: coaching staff per team and role, chosen by an admin from HRS officials
- Training sessions: weekly training times per team, set by an admin
- Coach photos: one uploaded photo per coach (HRS person id)
- Club info: a single row (`id = "main"`) with phone, email, address and office hours
- History: `history_content` (single row: intro, mission, up to 4 highlight boxes), `history_events` (timeline,
  free-text year + optional photo, ordered by the first 4-digit year) and `history_photos` (gallery with captions).
  On the first request the page is filled with verified facts from `server/historySeed.ts`; after that it is only
  edited in Admin → History (deleting events never brings the seed back).
- Images: uploaded post images (bytea) — kept in the database so no persistent disk is needed on the host
- Sessions: server-side session storage for authentication

**HRS data (not stored):** fixtures, results, standings, player stats and match details come live from the
Croatian Handball Federation's data feed — see "HRS Data" below.

**API Design:**
- Storage interface pattern (`IStorage`): `DatabaseStorage` when `DATABASE_URL` is set, in-memory `MemStorage` otherwise (local development only; production refuses to start without a database)
- Posts: public `GET /api/posts`, `GET /api/posts/:id`; authenticated `POST`/`PATCH`/`DELETE`
- Images: authenticated `POST /api/images` (raw image body, max 5 MB), public `GET /api/images/:id`
- Coaching staff: public `GET /api/staff` (includes each coach's `photoUrl`); authenticated `POST`/`PATCH` (role/team)/`DELETE /api/staff/:id`
  and `PUT /api/staff/photos/:personId` `{ photoUrl }` (an uploaded `/api/images/…` URL or `null`; one photo per person, shared across teams)
- History: public `GET /api/history`; authenticated `PUT /api/history/content`, `POST`/`PUT`/`DELETE /api/history/events/:id`,
  `POST`/`PATCH` (caption)/`DELETE /api/history/photos/:id` (`server/historyRoutes.ts`). Replaced or deleted photos are removed.
- Page top images: public `GET /api/page-banners` (`{ page: imageUrl }` for pages with a custom image); authenticated
  `PUT /api/page-banners/:page` `{ imageSrc }` (uploaded image or `null` = back to the default). Pages: home, first-team,
  u15, u13, news, history, contact; defaults are in `client/src/lib/pageBanners.ts`. Edited in Admin → Naslovne slike.
- Contact details: public `GET /api/club-info` (built-in defaults until saved); authenticated `PUT /api/club-info`
  (phone, email, address, office hours – address and hours one item per line). Edited in Admin → Contact Details.
- Training schedule: public `GET /api/trainings` (sorted by day and time); authenticated `POST`/`PATCH`/`DELETE /api/trainings/:id`
  (day 1–7 = Monday–Sunday, times `HH:MM`, end after start, optional location). Edited in Admin → Training Schedule.
- HRS: public read-only `GET /api/hrs/teams`, `/api/hrs/teams/:team/{standings,matches,players}`, `/api/hrs/matches/:id`,
  and `/api/hrs/officials` (all Biograd team officials from this season's match sheets)

**Coaching staff:** HRS lists team officials (A, B, …) per match but gives no job titles. In Admin → Coaching
Staff an admin picks people from `/api/hrs/officials` and assigns each to a team (Prva ekipa, U15, U13) with a
role (Glavni trener, Pomoćni trener, Trener vratara, Kondicijski trener). Assignments are stored in the
`staff_assignments` table (name copied, so pages work when HRS is down); team pages show only these.
- Response format: JSON with proper HTTP status codes and error messages

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI component primitives (@radix-ui/*) - 20+ packages for accessible components
- Lucide React for iconography
- date-fns for date formatting and manipulation
- react-day-picker for calendar/date selection
- cmdk for command palette functionality
- vaul for drawer components
- embla-carousel-react for carousels
- recharts for data visualization

**Development & Build Tools:**
- Replit-specific plugins (@replit/vite-plugin-*) for development experience
- ESBuild for server bundling in production
- PostCSS with Tailwind and Autoprefixer
- TypeScript for type checking

**Database & Authentication:**
- pg - PostgreSQL client (works with Render, Neon and a local Postgres)
- json5 - parses the HRS feed files without evaluating them
- Drizzle ORM with Zod schema validation (drizzle-zod)
- openid-client for OIDC authentication
- Passport.js for authentication strategies
- express-session for session management

**Form Handling:**
- React Hook Form with @hookform/resolvers for form state
- Zod for runtime schema validation

**Styling:**
- Tailwind CSS with custom configuration
- class-variance-authority (CVA) for component variants
- clsx and tailwind-merge for conditional class composition

**Croatian Language Support:**
- All UI text in Croatian language
- Date formatting configured for Croatian locale
- Content structure follows Croatian handball league conventions (2. HRL Jug, etc.)

## HRS Data

HRS has no official public API. The site reads the same public data files that power the standings widget
on hrs.hr, served by HRS's data vendor (Sportinfocentar):

- `https://www.sportinfocentar2.com/coman/natjecanje<competitionId>.js` — standings, all matches, player season stats
- `https://www.sportinfocentar2.com/coman/utakmice/<matchId>.js` — lineups with per-player stats, play-by-play
- `https://api.hrs.hr/ed/licence/1` — list of current competitions (used to find IDs)

Code lives in `server/hrs/`:
- `config.ts` — club id and **the competition IDs for each team. Update these at the start of every season.**
- `parse.ts` — the files are JavaScript object literals, not JSON; they are parsed with JSON5 and never `eval`-ed
- `client.ts` — fetching with a cache (competitions 5 min, match files 1 min live / 1 h finished); serves the last good copy if HRS is down
- `map.ts` — converts vendor field names into the types in `shared/hrs.ts`
- `routes.ts` — the `/api/hrs/*` endpoints (match detail only for our club's matches, so it is not an open proxy)

The feed is unofficial and may change without notice — if pages show "trenutno nisu dostupni", check the
server log for `HRS feed` errors.

## Deploying on Render

`render.yaml` (a Render Blueprint) creates the web service and its Postgres database. All settings are listed in
`.env.example`.

**1. Google sign-in (one time).** In [Google Cloud Console](https://console.cloud.google.com/):
- Create a project → *APIs & Services* → *OAuth consent screen*: user type **External**, app name "RK Biograd",
  your email as support/developer contact. Publish it (only name/email/profile scopes are used, no review needed).
- *Credentials* → *Create credentials* → *OAuth client ID* → type **Web application**.
  Authorized redirect URI: `https://<service-name>.onrender.com/api/callback` (add
  `https://<your-domain>/api/callback` too once a custom domain is used). Keep the client ID and secret.

**2. Code on GitHub.** Push this repository to GitHub (Render deploys from it).

**3. Create the Blueprint.** Render dashboard → *New* → *Blueprint* → choose the repository. Render reads
`render.yaml` and asks for:
- `ADMIN_EMAILS` – Google accounts allowed into the admin panel, comma-separated (e.g. `josip.dosen55@gmail.com`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – from step 1
- `PUBLIC_URL` – leave empty (uses the onrender.com address) or set your own domain later

`DATABASE_URL` and `SESSION_SECRET` are filled in automatically. *Apply* creates the database and the service.

**4. Deploy.** Each deploy runs `npm ci && npm run build`, then `npm run db:push` (creates/updates tables), then
`npm start`. Render checks `/healthz`. Every push to GitHub deploys again.

**5. Test the admin login.** Open `https://<service-name>.onrender.com/admin` → sign in with Google → you land on
`/admin`. *Log out* is on the dashboard. A Google account not in `ADMIN_EMAILS` sees "Pristup odbijen".
Removing an email from `ADMIN_EMAILS` (then *Save*, which restarts the service) locks that person out.

**Custom domain (optional):** service → *Settings* → *Custom Domains* → add `rkbiograd.hr` and follow the DNS steps,
set `PUBLIC_URL=https://rkbiograd.hr`, and add `https://rkbiograd.hr/api/callback` to the Google redirect URIs.

**Plans:** `render.yaml` uses a small paid web instance (always on) and a small paid database, because Render's free
Postgres is deleted after 30 days and the free web service sleeps after 15 minutes (and skips `preDeployCommand` —
run `npm run db:push` yourself with the database's *External* URL, adding `?sslmode=require` if needed).

## Local Development (Windows/macOS/Linux)

- `npm run dev`, then open http://localhost:5000. Without `GOOGLE_CLIENT_ID` login is disabled and every request acts as a local admin.
- Without `DATABASE_URL`, posts are kept in memory and lost on restart. To keep them, run a local Postgres and put the URL in `.env`:
  `docker run -d --name rkbiograd-db -e POSTGRES_PASSWORD=dev -p 5433:5432 postgres:16`, then
  `DATABASE_URL=postgres://postgres:dev@localhost:5433/postgres` in `.env`, then `npm run db:push`.

## Recent Changes

### October 2026 - Live HRS data, persistent news, Windows support
- Replaced the broken HTML scraper (the hrs.hr page has no tables; data is drawn by JavaScript) with the HRS data feed
- Senior, U15 and U13 pages show live standings, fixtures/results and player stats; new match pages at `/utakmica/:id`
- Removed manual fixture and league-table admin (data now comes from HRS)
- News posts and users stored in Postgres; image upload for posts; news list `/news` and article pages `/news/:id`
- Fixed: creating posts from the admin panel always failed (`publishedAt` validation); post edits were not validated;
  the server crashed after any request error and on any Vite error in development
- Local development mode and Windows-compatible npm scripts

### October 13, 2025 - Authentication Flow Fixed
- **Critical Fix**: Changed all authentication redirects from client-side routing (`setLocation()`) to full page navigation (`window.location.href`)
- This ensures unauthenticated users properly reach the backend `/api/login` endpoint to trigger Replit Auth OIDC flow
- Affected files: All admin pages (AdminDashboard, AdminPosts; AdminFixtures and AdminLeagueTable have since been removed)
- Applied to both initial auth guards and mutation error handlers
- Users can now successfully log in and access the CMS admin panel

## Important Technical Notes

### Authentication Redirects
- **ALWAYS use `window.location.href = "/api/login"`** for authentication redirects
- **NEVER use `setLocation("/api/login")`** - this keeps the user in the SPA and prevents the backend login flow from triggering
- All admin pages check authentication on mount and redirect unauthenticated users
- All mutations check for 401 errors and redirect to login if session expires