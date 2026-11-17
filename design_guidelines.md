# Design Guidelines for RK Biograd Handball Club Website

## Design Approach: Sports Community Platform
**Reference-Based Approach** inspired by modern sports team websites (rkrudar.hr, professional club sites) with emphasis on community engagement, dynamic content updates, and team pride.

**Core Principles:**
- Bold, energetic design reflecting team spirit and athletic performance
- Clear information hierarchy prioritizing latest news and match results
- Community-focused with accessible team information and history
- Data-rich displays (tables, fixtures) integrated seamlessly with editorial content

## Color Palette

Club colors are **white, dark blue and light blue** (from the crest). All tokens live in `client/src/index.css`.

**Brand (light mode):**
- Primary / dark blue: 230 80% 22% (#0B1C65) – header, footer, buttons, headings, "our team" highlights
- Accent / light blue: 202 88% 55% (#29A9F0) – active nav, badges, CTAs on dark backgrounds, bars and icons
- Secondary: 203 90% 93% – pale light blue fills (stat boxes, chips)
- Background: 216 45% 97% (very light blue-grey page), cards white
- `.text-accent-strong` (202 90% 34%) – light blue dark enough for small text on white
- `.bg-brand-gradient` – dark blue gradient for header, hero, page banners, scoreboard, footer

**Results:** win = dark blue, loss = muted grey, live = pulsing light blue badge. No red/green/orange
except red (`destructive`) for delete buttons and errors in admin.

## Typography

**Font Families:**
- Headlines: 'Barlow Condensed' (600–800, uppercase for page and section titles) – `font-display`
- Body: 'Inter', system-ui (400–700)
- Numbers in tables: Inter with tabular digits (`font-mono` maps to Inter + `tabular-nums`)

**Type Scale:**
- Hero Title: text-5xl md:text-6xl lg:text-7xl font-bold
- Section Headers: text-3xl md:text-4xl font-bold
- Post Titles: text-xl md:text-2xl font-semibold
- Body Text: text-base leading-relaxed
- Table Data: text-sm md:text-base font-mono
- Labels/Meta: text-sm text-gray-500

## Layout System

**Spacing Primitives:** Consistently use Tailwind units of **4, 6, 8, 12, 16** for spacing
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Margins: m-4, m-6, m-8

**Container Widths:**
- Max content width: max-w-7xl mx-auto px-4
- News grid: max-w-6xl
- Data tables: w-full with horizontal scroll on mobile
- Forms: max-w-2xl

**Grid Patterns:**
- News Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Team Rosters: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Fixture Cards: grid-cols-1 md:grid-cols-2

## Component Library

**Navigation:**
- Sticky header with team logo (left), nav links (center), CTA button (right)
- Mobile: Hamburger menu with slide-in drawer
- Active page indicator with bottom border (accent color)

**Hero Section (Homepage):**
- Large hero image (team action shot or stadium) with gradient overlay
- Headline announcing latest achievement/match
- Quick stats bar (next match, league position, recent form)
- Prominent CTA to latest news or fixtures

**News/Post Cards:**
- Featured image (16:9 aspect ratio)
- Category badge (top-left overlay: Seniori, U15, U13)
- Date and title
- Excerpt (2-3 lines)
- Hover: slight elevation and image scale

**League Table:**
- Sticky header row on scroll
- Team row highlighting (RK Biograd in brand color background)
- Responsive: horizontal scroll on mobile, full display on desktop
- Columns: Position, Team, Played, Won, Draw, Lost, GF, GA, GD, Points
- Alternating row backgrounds for readability

**Fixture/Result Cards:**
- Split design: Home team (left), Score/Time (center), Away team (right)
- Status badges: "UŽIVO" (live), "ZAVRŠENO" (finished), "PREDSTOJI" (upcoming)
- Location and date below
- Win/loss color coding on completed matches

**Team Section (First Team, U15, U13):**
- Player grid with photos, names, positions, numbers
- Coach spotlight section
- Team statistics and achievements
- Match history table

**CMS Admin Panel:**
- Dashboard with quick stats
- Post editor with rich text, image upload, category selection
- Fixture manager: date picker, score inputs, opponent selector
- Table editor: drag-to-reorder teams, editable stats

**Contact Page:**
- Two-column: Form (left), Club info/map (right)
- Club address, phone, email
- Social media links
- Training schedule information

**History Page:**
- Timeline layout with milestones
- Trophy/achievement showcases
- Historical photos gallery
- Notable players hall of fame

**Footer:**
- Three-column: Club info, Quick links, Social media
- Newsletter signup
- Sponsors logos
- Copyright and club badge

## Images

**Required Images:**
- **Hero Image:** Dynamic team action shot (players in game), 1920x800px minimum, high energy composition
- **Post Featured Images:** Match photos, training sessions, team celebrations (16:9 ratio)
- **Team Photos:** Individual player headshots (square format) with consistent background
- **History Section:** Archive photos, trophy images, historic team photos
- **Placeholder:** Use team colors (brand primary) with club badge for missing images

**Image Treatment:**
- Hero: Dark gradient overlay (from bottom) for text legibility
- Cards: Subtle hover zoom effect (scale-105)
- Team photos: Rounded corners (rounded-lg)
- Consistent lazy loading for performance

## Animations & Interactions

**Minimal, Performance-Focused:**
- Card hover: Subtle elevation (shadow transition)
- Image hover: Slight scale effect
- Page transitions: None (instant navigation)
- Button states: Standard hover/active built-in states
- Table row hover: Light background color change
- NO scroll-triggered animations
- NO complex transitions

## Dark Mode Consistency

All interactive elements maintain dark mode integrity:
- Form inputs: Dark backgrounds (220 12% 18%) with lighter borders
- Text fields: Light text on dark surfaces
- Dropdowns/selects: Consistent dark styling
- Buttons: Proper contrast in both modes
- Tables: Alternating rows remain visible in dark mode