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
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js strategy for authentication flow
- Session management with PostgreSQL-backed session store (`connect-pg-simple`)
- Protected routes using `isAuthenticated` middleware
- User profile data synchronized with Replit identity provider

**Database Layer:**
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL as the database provider
- WebSocket-based connection pooling for Neon serverless
- Schema-first approach with Zod validation integration
- Migration system via Drizzle Kit

**Data Models:**
- Users (from Replit Auth): id, email, firstName, lastName, profileImageUrl
- Posts: blog-style content with categories, images, timestamps
- Fixtures: match schedules with teams, scores, dates, locations, status (upcoming/live/finished)
- League Table: team standings with statistics (wins, draws, losses, goals, points)
- Sessions: server-side session storage for authentication

**API Design:**
- Storage interface pattern (`IStorage`) with in-memory implementation for development
- CRUD operations for posts, fixtures, and league table data
- Separate endpoints for authenticated operations (creating/updating content)
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
- @neondatabase/serverless - Neon PostgreSQL client with WebSocket support
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

## Recent Changes

### October 13, 2025 - Authentication Flow Fixed
- **Critical Fix**: Changed all authentication redirects from client-side routing (`setLocation()`) to full page navigation (`window.location.href`)
- This ensures unauthenticated users properly reach the backend `/api/login` endpoint to trigger Replit Auth OIDC flow
- Affected files: All admin pages (AdminDashboard, AdminPosts, AdminFixtures, AdminLeagueTable)
- Applied to both initial auth guards and mutation error handlers
- Users can now successfully log in and access the CMS admin panel

## Important Technical Notes

### Authentication Redirects
- **ALWAYS use `window.location.href = "/api/login"`** for authentication redirects
- **NEVER use `setLocation("/api/login")`** - this keeps the user in the SPA and prevents the backend login flow from triggering
- All admin pages check authentication on mount and redirect unauthenticated users
- All mutations check for 401 errors and redirect to login if session expires