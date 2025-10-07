# Design Guidelines for RK Biograd Handball Club Website

## Design Approach: Sports Community Platform
**Reference-Based Approach** inspired by modern sports team websites (rkrudar.hr, professional club sites) with emphasis on community engagement, dynamic content updates, and team pride.

**Core Principles:**
- Bold, energetic design reflecting team spirit and athletic performance
- Clear information hierarchy prioritizing latest news and match results
- Community-focused with accessible team information and history
- Data-rich displays (tables, fixtures) integrated seamlessly with editorial content

## Color Palette

**Primary Colors (Light Mode):**
- Brand Primary: 210 85% 45% (Deep ocean blue - Croatian coastal reference)
- Brand Secondary: 200 75% 35% (Darker navy for headers/important elements)
- Accent: 15 90% 55% (Energetic orange for CTAs and highlights)

**Primary Colors (Dark Mode):**
- Background: 220 15% 12% (Rich dark blue-gray)
- Surface: 220 12% 18% (Elevated surfaces)
- Brand Primary: 210 75% 60% (Brighter blue for dark mode)
- Accent: 15 85% 60% (Vibrant orange maintaining energy)

**Semantic Colors:**
- Success/Win: 145 60% 45% (Victory green for match wins)
- Neutral/Draw: 40 45% 55% (Amber for draws)
- Loss: 0 0% 50% (Neutral gray, de-emphasized)

## Typography

**Font Families:**
- Headlines: 'Inter', system-ui (Bold, 700-900 weights for impact)
- Body: 'Inter', system-ui (Regular 400, Medium 500)
- Data/Tables: 'JetBrains Mono', monospace (Clear number distinction)

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