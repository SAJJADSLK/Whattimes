# Chronos Architecture & Design System

## Competitive Analysis

### time.is
**Strengths:**
- Exact atomic clock time synchronization
- Massive city coverage (7+ million locations)
- Multi-language support (58 languages)
- Minimal, distraction-free interface
- Fast load times

**Weaknesses:**
- Dated visual design (early 2000s aesthetic)
- Limited interactivity and features
- No user accounts or personalization
- Poor mobile experience
- No meeting scheduling or team features

### WorldTimeBuddy
**Strengths:**
- Excellent timezone comparison UI (grid-based)
- Meeting scheduling features
- User accounts and saved preferences
- Mobile app available
- Intuitive time scrubber interaction

**Weaknesses:**
- Cluttered interface with too many options
- Slow performance on large datasets
- Outdated visual design
- Limited customization
- No embeddable widgets
- No DST tracking or city detail pages

## Chronos Competitive Advantages

**1. Premium Visual Design**
- Modern, elegant interface inspired by Apple and Linear
- Smooth animations and micro-interactions (Framer Motion)
- Dark/light theme support with carefully chosen color palette
- Pixel-perfect attention to detail

**2. Superior Time Accuracy**
- Server-time offset calculation for real-time accuracy
- NTP synchronization on page load
- Continuous time sync via WebSocket for precision
- Atomic clock reference (pool.ntp.org)

**3. Advanced Features**
- Smart Meeting Invite Generator with localization
- Team Dashboard with working hours overlap visualization
- Countdown timers with shareable links
- DST tracker with global change notifications
- Embeddable widgets (iframe + script snippet)
- SEO-optimized city detail pages

**4. User Experience**
- Draggable time scrubber for intuitive timezone exploration
- Real-time city search and filtering
- Persistent user preferences and saved teams
- Shareable links for meetings, countdowns, and team views
- Responsive design optimized for all devices

## Technical Architecture

### Frontend Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4 + custom design tokens
- **Animations:** Framer Motion for smooth interactions
- **State Management:** TanStack React Query + tRPC
- **UI Components:** shadcn/ui for consistent, accessible components

### Backend Stack
- **Runtime:** Node.js (Express 4)
- **API:** tRPC 11 for type-safe RPC
- **Database:** MySQL/TiDB with Drizzle ORM
- **Authentication:** Manus OAuth
- **Real-time:** WebSocket for time sync updates

### Key Technical Decisions

**1. Time Synchronization Strategy**
- On page load: Calculate offset between browser time and server time
- Store offset in React state with MotionValue for smooth animations
- Update via WebSocket every 60 seconds to maintain accuracy
- Use requestAnimationFrame for smooth 60fps clock display

**2. Database Schema**
- `cities` table: city name, timezone, coordinates, DST rules
- `users` table: authentication and preferences
- `user_favorite_cities` table: saved cities per user
- `meeting_invites` table: shareable meeting links
- `countdown_timers` table: shareable countdown URLs
- `team_dashboards` table: saved team configurations

**3. SEO Optimization**
- Server-side rendering (SSG) for city detail pages
- Dynamic meta tags per city page
- Structured data (JSON-LD) for timezone information
- Sitemap generation for 100+ city pages
- Canonical URLs to prevent duplicate content

**4. Widget Architecture**
- Web Component for embeddable widget
- iframe sandbox for security
- Script snippet that dynamically injects iframe
- Customization options stored as query parameters
- Shadow DOM for style isolation

## Design System

### Color Palette
- **Primary:** Deep blue (#0F172A) - trust, precision
- **Accent:** Vibrant cyan (#06B6D4) - energy, modernity
- **Success:** Emerald green (#10B981) - working hours overlap
- **Warning:** Amber (#F59E0B) - partial overlap
- **Danger:** Rose red (#F43F5E) - no overlap
- **Neutral:** Slate gray (#64748B) - secondary text
- **Background:** Off-white (#F8FAFC) light mode / Deep slate (#0F172A) dark mode

### Typography
- **Display:** Inter 900 - large headings, hero clock
- **Heading:** Inter 700 - section titles
- **Body:** Inter 400 - regular text
- **Mono:** JetBrains Mono - time displays, code

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Component Library
- **Clock Display:** Large digital clock with smooth animation
- **City Card:** Compact city time display with timezone info
- **Time Grid:** 24-hour grid for timezone comparison
- **Meeting Invite Card:** Visual meeting time display
- **Team Dashboard Card:** Team member availability
- **Countdown Display:** Large countdown timer
- **DST Alert:** Notification for upcoming changes

### Animation Principles
- **Entrance:** 200ms ease-out from 0.95 scale + opacity
- **Interaction:** 150ms ease-out for button presses
- **Drag:** Smooth follow with spring physics
- **Time Update:** Smooth number transitions (no jumps)
- **Hover:** Subtle scale (1.02) + shadow elevation

## Data Model

### Cities Table
```
id: int
name: string
country: string
timezone: string (IANA)
latitude: float
longitude: float
utcOffset: int (minutes)
dstRules: json
region: string (continent)
searchKeywords: string
createdAt: timestamp
```

### Users Table
```
id: int
openId: string (OAuth)
name: string
email: string
role: enum (user, admin)
theme: enum (light, dark, auto)
defaultTimezone: string
createdAt: timestamp
updatedAt: timestamp
```

### User Favorite Cities
```
id: int
userId: int
cityId: int
order: int
createdAt: timestamp
```

### Meeting Invites
```
id: int
userId: int
inviteCode: string (unique)
title: string
description: string
cities: json (array of city IDs)
meetingTime: timestamp (UTC)
createdAt: timestamp
expiresAt: timestamp
```

### Countdown Timers
```
id: int
userId: int (nullable for public)
countdownCode: string (unique)
title: string
targetTime: timestamp (UTC)
timezone: string
createdAt: timestamp
expiresAt: timestamp
```

## API Endpoints (tRPC Procedures)

### Public Procedures
- `cities.search(query)` - Search cities
- `cities.getByRegion(region)` - Get cities by continent
- `cities.getDetails(cityId)` - Get city detail page
- `time.getCurrentTime()` - Get server time for offset calculation
- `meetingInvites.getByCode(code)` - Get meeting invite details
- `countdowns.getByCode(code)` - Get countdown details

### Protected Procedures
- `user.getFavoriteCities()` - Get user's saved cities
- `user.addFavoriteCity(cityId)` - Add to favorites
- `user.removeFavoriteCity(cityId)` - Remove from favorites
- `teams.create(cities)` - Create team dashboard
- `teams.update(teamId, cities)` - Update team
- `teams.getTeams()` - Get user's teams
- `meetingInvites.create(data)` - Generate meeting invite
- `countdowns.create(data)` - Create countdown timer

## Performance Targets
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Clock Update Latency:** < 16ms (60fps)
- **Search Response:** < 100ms
- **API Response:** < 200ms

## Security Measures
- **CSP Headers:** Restrict script sources, prevent XSS
- **HSTS:** Enforce HTTPS for all connections
- **Rate Limiting:** 100 requests/minute per IP
- **CORS:** Whitelist trusted origins only
- **Input Validation:** Sanitize all user inputs
- **JWT Tokens:** HttpOnly, Secure, SameSite=Strict cookies
