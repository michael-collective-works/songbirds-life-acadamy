# S.L.A.Y. Website — Architecture and Phased Plan

This plan outlines the architecture, data, APIs, security, and phased delivery for the Songbirds Life Academy site. We will stop after each testable and deployable phase/subphase for review.

## Goals
- Public-facing, mobile-friendly “front door” for parents seeking daycare information.
- Lightweight CMS for events, team, and storefront listing (no checkout – redirect to Square).
- Secure, Google SSO–protected admin portal.
- Spam protection for public forms.

## Tech Stack
- Framework: Next.js App Router (React, TypeScript)
- Styling: Tailwind CSS + shadcn/ui (accessible components)
- Icons: lucide-react
- Hosting/Deployment: Vercel
- Images/Uploads (planned): Vercel Blob
- Database (planned): Neon (Postgres) with SQL migrations
- Auth (planned): NextAuth v5 with Google provider
- Rate limiting (planned): Upstash
- Captcha (planned): Cloudflare Turnstile or hCaptcha
- Email (planned): Resend for notifications, or provider of your choice

## Information Architecture (Public)
- Home (/)
  - Hero with logo and value prop
  - Program intro (Infant-Toddler highlight text provided)
  - Events preview (teaser)
  - Store preview (uniforms + merch) with redirect to Square
  - Join Us CTA
  - Contact info (phone, address, hours)
  - Footer (tagline)
- About (/about)
  - Mission, story, team section (dynamic later)
- Events (/events)
  - Paginated events list (dynamic later)
- Store (/store)
  - Catalog listing linking to Square product/category pages (dynamic later)
- Join Us (/join)
  - Application/Volunteer form (dynamic later) with spam protection

## Admin Portal (Protected)
- /admin (hidden, restricted via Google SSO)
  - Dashboard
  - Content: Events CRUD
  - Team Members CRUD
  - Store Items CRUD (link targets to Square)
  - Media uploads via Vercel Blob
  - Form submissions (Join Us) review

## Data Model (Planned)
- team_members
  - id (uuid), name, title, headshot_url, bio, created_at, updated_at, is_active
- events
  - id (uuid), title, description, date, start_time, end_time (nullable), hero_image_url (nullable), created_at, updated_at, is_published
- store_items
  - id (uuid), title, image_url, external_url (Square link), category (uniform|merch), is_active, created_at, updated_at
- applications
  - id (uuid), first_name, last_name, email, phone, kind (employment|volunteer), created_at, ip, user_agent, status (new|reviewed|archived)
- admins
  - id (uuid), email (Google SSO), role (owner|editor), created_at

Note: This model will be refined in Phase 2 with SQL scripts and migrations.

## API Endpoints (Planned)
- Public (GET only; with caching)
  - GET /api/events?page=...&pageSize=...
  - GET /api/team
  - GET /api/store?category=...
- Public (POST; spam-protected)
  - POST /api/join-us
- Admin (Protected)
  - CRUD for /api/admin/events
  - CRUD for /api/admin/team
  - CRUD for /api/admin/store
  - Media upload endpoints (signed URLs for Vercel Blob)

## Security & Compliance (Planned)
- Admin routes behind NextAuth (Google SSO).
- CSRF protection on POST forms.
- Captcha + rate limiting for public POST endpoints.
- Input validation (zod) and server-side sanitization.
- Role-based access control for admin actions.

## SEO & Performance
- Metadata, OpenGraph tags, social image.
- Sitemap.xml and robots.txt.
- Image optimization, font loading, caching headers.
- Accessible and mobile-first UX.

---

## Phased Delivery

### Phase 1A — Public Front Door (Static)
Deliver a deployable, responsive site:
- Navigation, mobile menu, footer with tagline.
- Hero with logo, callouts, clear CTAs to Brightwheel form and Square store.
- Main page content includes the provided “Infant-Toddler Care” text.
- Static “About,” “Events,” “Store,” and “Join Us” pages with clear messaging and working links (no data backend yet).
- Contact info, hours, location, and social handle.

Success criteria:
- Deployed site with no broken links.
- All buttons navigate somewhere meaningful (internal page or external).
- Lighthouse: mobile-friendly and accessible structure.

STOP here for review.

### Phase 1B — Content Polish & Visual Enhancements (Static)
- Irregular shape backgrounds and motif integration refined.
- Imagery/theme consistency with brand colors.
- Basic SEO: title/description, OG tags; sitemap & robots.

STOP here for review.

### Phase 2 — Admin Portal & Data Layer
- Choose DB (Neon Postgres) and provision.
- Implement Google SSO (NextAuth), roles.
- Build CRUD for events, team, store items; SQL migrations.
- Media uploads to Vercel Blob.

STOP here for review.

### Phase 3 — Public Dynamic Content
- Dynamic Events listing with pagination.
- Dynamic Team page (bios with headshots).
- Store listing driving to Square links.
- Join Us form (POST) with spam protection and notifications.

STOP here for review.

### Phase 4 — Security Hardening & Observability
- Rate limiting (Upstash), Captcha, validation (zod).
- Monitoring/alerts; structured logging.
- E2E tests for core flows (Playwright).

STOP here for review.

### Phase 5 — QA, Accessibility, and Launch
- Accessibility pass (WCAG-oriented checks).
- Performance tuning (images, code-splitting).
- Final launch checklist.

---

## Open Questions (to confirm before Phase 2)
1. Authentication: Is Google SSO via NextAuth acceptable, or do you prefer Supabase Auth?
2. Database: Neon Postgres OK, or do you prefer Supabase’s Postgres?
3. Media storage: Use Vercel Blob for simplicity, or your preferred storage?
4. Square: Do you want per-item deep links to Square product pages, or is a single category/storefront link sufficient?
5. Branding: Are there specific hex values for teal, navy, gold/bronze, burnt orange, and dark red you’d like us to lock in?
6. Copy & Images: Will you provide staff headshots and bios in Phase 2, or should we seed with placeholders?
7. Forms: Do you have a preferred captcha provider (Cloudflare Turnstile vs hCaptcha)?
\`\`\`

<CodeProject id="slay-website">
