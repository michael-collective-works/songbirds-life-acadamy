# Songbirds Life Academy — Lightweight Landing Redesign

**Status:** Design approved by project owner. Implementation plan pending.
**Date:** 2026-04-15
**Repo:** [`michael-collective-works/songbirds-life-acadamy`](https://github.com/michael-collective-works/songbirds-life-acadamy) (note: remote repo name contains a typo — "acadamy" — but we are not renaming it.)

## Goal

Replace the existing v0-generated Next.js scaffold (admin CMS, database, auth, file uploads) with a **single-page, static marketing site** for Songbirds Life Academy — a small infant–toddler daycare in St. Francisville, LA — hosted free-forever on Cloudflare Pages. The site exists to (1) communicate the program's identity, (2) surface contact information, and (3) route parents into the owner's existing Google Form for inquiries.

## Non-Goals

Explicitly **out of scope** for this redesign:

- Any content management system, admin dashboard, or authenticated surface
- Any backend database (Neon, Supabase, D1)
- Any authentication provider (NextAuth, Clerk, etc.)
- Any custom form handler, email service, or CAPTCHA infrastructure
- Multi-page navigation for events, team, or store (all previously scaffolded in v0)
- Image upload flows (Vercel Blob, etc.)

Everything from the v0 prototype's `app/admin/*`, `app/api/*`, `auth.ts`, `lib/db.ts`, `lib/supabase.ts`, `lib/rate-limit.ts`, and `scripts/sql/` is dropped from production. Those files may remain in git history but will not be deployed.

## User

The owner of the daycare is a small-business proprietor who does not pay for infrastructure and does not wish to. Parents arriving at the site are typically on mobile, evaluating childcare options, and want three things quickly: what the program is, whether it's legitimate, and how to reach someone.

## Brand Brief (from owner)

- **Feelings to evoke:** calm, intriguing, warmth, creative
- **Message:** "Through a community of creatives with deep roots and rich legacy, we can build the ECE community we want to see in our town. Unity, child advocacy, creativity, legacy."
- **Canonical name:** Songbirds Life Academy (not "for the Youth")
- **Tagline:** "Learning through play, immersed in music."
- **Subhead:** "A Strong Start, A Lasting Song"
- **Palette (owner-specified):** teal, navy, cream, blue, gold, bronze, burnt orange, pops of dark red, wood (like acoustic guitar)

## Architecture

### Stack

| Layer | Choice | Why |
|---|---|---|
| Static site generator | **Astro** | Minimal JavaScript shipped, excellent DX for content-heavy one-pagers, great with Tailwind |
| Styling | **Tailwind CSS** (via `@astrojs/tailwind`) | Consistent with what the team knows; utility-first speed |
| Hosting | **Cloudflare Pages** | Free, commercial-use permitted, built-in branch preview URLs, global CDN |
| Domain | `songbirdslifeacademy.com` (owner already owns, registered at GoDaddy) | No change of registrar |
| DNS | **Remain at GoDaddy** | Avoids nameserver transfer; we add a CNAME at GoDaddy pointing to Cloudflare Pages |
| Inquiry form | **Existing Google Form** (opens in new tab) | Zero backend, spam protection built in, submissions land in Google Sheets |
| Analytics (optional) | **Cloudflare Web Analytics** | Free, privacy-friendly, no cookies |

### Cost

| Item | Cost |
|---|---|
| Cloudflare Pages | Free |
| Cloudflare Web Analytics | Free |
| Google Forms | Free |
| Domain registration (already owned) | ~$15/year at GoDaddy |
| GoDaddy hosting plan | **Cancel after cutover** (saves $5–15/month) |
| **Total new spend** | **$0** |

### Deployment flow

1. GitHub repo `michael-collective-works/songbirds-life-acadamy` is connected to a new Cloudflare Pages project.
2. Production branch is `main`. Every push to `main` deploys to both `songbirds-life-acadamy.pages.dev` (Cloudflare's provided subdomain) and `songbirdslifeacademy.com` (custom domain).
3. Every non-`main` branch gets an automatic preview deploy at `<branch>.songbirds-life-acadamy.pages.dev` — used for design variants (see below).

### DNS cutover

The domain stays at GoDaddy. We add a single CNAME record at GoDaddy:
```
www    CNAME    songbirds-life-acadamy.pages.dev
@      CNAME    songbirds-life-acadamy.pages.dev   (or A records if CNAME at apex is disallowed)
```
Cloudflare Pages provides the exact required values in its custom-domain setup UI. Cloudflare issues a free TLS cert automatically. Owner can then cancel her GoDaddy hosting plan (not the domain registration).

## Design Direction

### Layout (single page, mobile-first)

In order from top to bottom:

1. **Nav bar** — logo/wordmark, two links: "About" (anchor to story section), "Inquire ↗" (opens Google Form, new tab)
2. **Hero** — small label, serif headline ("A joyful start, *immersed in music.*"), short supporting copy, two CTAs: primary "Inquire ↗" and secondary "📞 225.635.7973" (tap-to-call on mobile)
3. **Hero photo band** — full-bleed image, dimmed with warm tint (recommended: overhead drum-kit photo `d8a27b87-*.jpg`)
4. **Mission / story** — small label "A STRONG START · A LASTING SONG", a large serif quote based on the owner's "community of creatives with deep roots and rich legacy" messaging, then the body copy provided by the owner
5. **Asymmetric two-photo strip** — 2:1 grid (piano + ribbons left, guitar staff right)
6. **Program highlights** — 2x2 grid of four cards with colored left-border accents (one card per bullet the owner provided)
7. **Trust badges** — horizontal strip: Louisiana State Licensed, Creative Curriculum®, Music-Immersed Philosophy, (a fourth slot for a partner badge — see Open Questions)
8. **CTA band** — full-width dark-navy section with a serif closing line ("Partner with us...") and a single burnt-orange "Begin an inquiry ↗" button
9. **Footer** — phone, address (linked to maps), hours, Instagram/Facebook (`@songbirdslifeacademy`)

### Typography

- **Headlines:** a serif that reads "rich legacy" — Playfair Display, Fraunces, or Cormorant Garamond via Google Fonts
- **Body:** system UI sans-serif stack for fast load + readability
- **Small labels:** uppercase, wide tracking, sans-serif

### Palette (approved)

| Token | Hex | Role |
|---|---|---|
| `--navy` | `#152846` | Primary text, nav, CTA bands |
| `--teal` | `#1f6e63` | Secondary accent, emphasis text |
| `--cream` | `#f4ebd7` | Page background |
| `--gold` | `#d4a44a` | Highlights, nav accents |
| `--bronze` | `#b8864a` | Dividers, bronze details |
| `--burnt-orange` | `#c75a2e` | Primary CTA |
| `--dark-red` | `#8b2e24` | Rare pop / emphasis |
| `--wood` | `#3a2d1a` | Photo tints, warm dark surface |

### Content (verbatim, per owner)

- **Hero tagline:** "Learning through play, immersed in music."
- **Subtitle:** "A Strong Start, A Lasting Song"
- **Body paragraph 1:** "At Songbirds, we believe the earliest years are the most important. Our Infant-Toddler Program (ages 6 weeks to 3 years) nurtures each child's development through warm, responsive care and intentional learning experiences in a safe, loving environment."
- **Body paragraph 2:** "Music is at the core of our academy's philosophy. From soft lullabies that calm to clapping, humming, dancing, and instrumentation, music is used daily to support emotional bonding, language development, social growth, and motor skills."
- **Body paragraph 3:** "We proudly use The Creative Curriculum® for Infants, Toddlers & Twos, and Preschool, a research-based approach that transforms routines into learning moments. Our teachers guide development through play, movement, and meaningful interaction, building a strong foundation for lifelong learning."
- **Highlights:**
  - Low teacher-to-child ratios for personalized care
  - Music and movement activities every day
  - Sensory-rich classrooms that promote exploration
  - Daily communication and photo updates for families
- **Closing:** "Partner with us to give your child a joyful beginning where learning and love go hand in hand."
- **Phone:** 225.635.7973
- **Address:** 5915 N. Commerce Street, St. Francisville, LA 70775
- **Hours:** 6:30AM – 5:30PM (extended hours available upon request)
- **Socials:** `@songbirdslifeacademy` on Facebook and Instagram

### Photos

Available in `/Users/mccune/_dev/SLAY/Website Pics/` (six files). Proposed mapping:

| File | Proposed use |
|---|---|
| `d8a27b87-*.jpg` (drums from above) | Hero photo band |
| `11070b50-*.jpg` (two girls at piano with ribbons) | Asymmetric strip — left |
| `a6d85c81-*.jpg` (male staff with guitar + licenses visible) | Asymmetric strip — right |
| `0b9ee1d2-*.jpg` (boy with train toys, drums background) | Section accent / program highlights |
| `15bfa375-*.jpg` (top-down alphabet foam mat) | Section accent |
| `dcf3d87f-*.jpg` (girl at piano with headphones) | Optional secondary hero or about-section accent |

Photos must be compressed (target: <300KB each) and served in modern formats (WebP/AVIF) via Astro's `astro:assets` image pipeline.

## Variant Preview Workflow

The owner will choose the final design from multiple deployed variants. We achieve this with Cloudflare Pages' built-in branch previews — **no extra infrastructure**.

### Variants to build

| Branch | Design direction | Description |
|---|---|---|
| `main` | — | Placeholder "coming soon" page initially; will receive the winning variant after selection |
| `variant/calm-creative` | **Calm Creative** (approved mockup) | Navy + cream + bronze, serif headlines, "community of creatives" messaging — this is the baseline design captured in this spec |
| `variant/warm-story` | **Warm Story** | Softer cream + amber, rounder typography, single-photo-per-section, least-formal feel |
| `variant/music-forward` | **Music Forward** | Bolder — drums photo leads, stronger color contrast, dark-red CTA, more magazine-like typography |

All three share the same content, same photos, same section order, same CTA targets (the Google Form link). They differ only in **palette execution, typography, and layout density**, so the owner is comparing personality, not information.

### URLs the owner receives

- `https://variant-calm-creative.songbirds-life-acadamy.pages.dev`
- `https://variant-warm-story.songbirds-life-acadamy.pages.dev`
- `https://variant-music-forward.songbirds-life-acadamy.pages.dev`

Each is a stable URL as long as the branch exists. Custom domain is **not** pointed at any of these during preview — the owner's live site stays untouched until she picks a winner.

### Cutover after selection

1. Merge the winning variant branch into `main`.
2. Point `songbirdslifeacademy.com` at the Cloudflare Pages project via GoDaddy CNAME.
3. Delete the losing variant branches.
4. Owner cancels her GoDaddy hosting plan.

## Astro Project Structure (target)

```
src/
  layouts/
    Base.astro               # html/head/meta, fonts, global styles
  components/
    Nav.astro
    Hero.astro
    PhotoBand.astro
    MissionStory.astro
    PhotoStrip.astro
    Highlights.astro
    TrustBadges.astro
    CtaBand.astro
    Footer.astro
  content/
    copy.ts                  # single source of truth for all body copy
    contact.ts               # phone, address, hours, socials, form URL
  pages/
    index.astro              # composes all components above
  styles/
    theme.css                # palette variables + tailwind @layer base
  assets/
    photos/                  # compressed WebP versions of Website Pics
public/
  favicon.svg
  logo.svg                   # existing SLAY logo from v0 prototype /public
astro.config.mjs
tailwind.config.mjs
package.json
```

Per the global code standards in `~/.claude/CLAUDE.md`: one export per file for models/types, arrow functions, single quotes, 2-space indent, no trailing commas, no inline comments, blank lines around `if`/`try`. Those apply to any `.ts` helper files we create.

## Risks & Open Questions

1. **Fourth trust badge slot** — the approved mockup had "Brightwheel Partnered" as a trust badge. Now that Brightwheel is not the inquiry destination, should this badge (a) stay, because she still uses Brightwheel internally for daily photo updates, (b) be replaced with something else (e.g., "Family Daily Updates"), or (c) be dropped, leaving three badges? *Default assumption: replace with "Daily Photo Updates" badge, which echoes one of the program highlights.*
2. **CNAME at apex** — some registrars (including GoDaddy historically) do not allow `CNAME` records at the zone apex (`@`). If that's the case, we'll use Cloudflare's `A`/`AAAA` values for the apex and `CNAME` only for `www`. Cloudflare Pages' custom-domain UI tells us which is supported.
3. **Existing live site on GoDaddy** — what exactly is currently published at `songbirdslifeacademy.com`? Before cutover we should confirm nothing we care about (contact form submissions, custom email addresses tied to the GoDaddy plan, etc.) breaks when the hosting plan is canceled. Domain registration and MX records (if any) stay regardless.
4. **Serif font choice** — three good candidates: Playfair Display (classic magazine), Fraunces (warmer, modern), Cormorant Garamond (literary, slightly more delicate). The spec doesn't lock one in; whichever we pick will be consistent across all three variants so the owner is comparing palette/layout, not typography.
5. **Old v0 code cleanup** — the current repo still contains the Next.js app/admin/CMS code. During implementation we'll move the Astro site to the repo root and either (a) delete the Next.js files outright or (b) move them to an `archive/` directory for reference. **Recommend option (a)** — git history preserves everything.

## Success Criteria

- Site loads in under 1 second on 3G-equivalent Lighthouse mobile simulation
- Lighthouse mobile performance score ≥ 95
- All three variants deployed and accessible at their preview URLs
- Owner selects a winning variant within the review window
- After merge to `main`, `songbirdslifeacademy.com` serves the new site with a valid TLS certificate
- Monthly recurring cost to the owner drops to $0 (beyond the domain renewal she already pays)
