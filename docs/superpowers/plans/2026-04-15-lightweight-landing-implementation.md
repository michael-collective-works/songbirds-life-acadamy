# Songbirds Life Academy — Lightweight Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the v0 Next.js CMS scaffold with a static Astro landing page, deploy to Cloudflare Pages, and produce three design variants the owner can compare via preview URLs.

**Architecture:** Single-page static site built with Astro + Tailwind v4, hosted on Cloudflare Pages (free), inquiry form delegated to an existing Google Form (opens in new tab). Three design variants live on separate git branches; Cloudflare Pages auto-deploys each branch to a stable preview URL for side-by-side comparison. After owner selects a winner, that branch merges to `main`, and `songbirdslifeacademy.com` (registered at GoDaddy) gets a CNAME pointing at Cloudflare.

**Tech Stack:**
- Astro 5.x (static site generator)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- TypeScript 5 (strict)
- Vitest + Cheerio (build-output integration test)
- Google Fonts (serif: Fraunces; sans: system stack)
- pnpm (package manager)
- Cloudflare Pages (host) via GitHub integration
- Wrangler CLI (for reproducible Pages project setup)

**Spec:** [`docs/superpowers/specs/2026-04-15-lightweight-landing-redesign-design.md`](../specs/2026-04-15-lightweight-landing-redesign-design.md)

---

## File Plan

Files this plan creates or touches:

| Path | Responsibility |
|---|---|
| `package.json` | Replace Next.js deps with Astro + Tailwind v4 + Vitest |
| `astro.config.mjs` | Astro config; register Tailwind Vite plugin |
| `tsconfig.json` | Astro-aware TypeScript config |
| `.gitignore` | Add `dist/`, `.astro/`, `node_modules/` |
| `src/layouts/Base.astro` | `<html>` shell, meta, fonts, global styles |
| `src/pages/index.astro` | Compose the one page from section components |
| `src/components/Nav.astro` | Header with name + two links |
| `src/components/Hero.astro` | Label + serif headline + copy + two CTAs |
| `src/components/PhotoBand.astro` | Full-bleed tinted photo |
| `src/components/MissionStory.astro` | "Community of creatives" block + body paragraphs |
| `src/components/PhotoStrip.astro` | 2-column asymmetric photo grid |
| `src/components/Highlights.astro` | 2x2 grid of four highlight cards |
| `src/components/TrustBadges.astro` | Horizontal badge strip |
| `src/components/CtaBand.astro` | Dark-navy full-width CTA |
| `src/components/Footer.astro` | Phone, address, hours, socials |
| `src/content/copy.ts` | All body copy as typed exports |
| `src/content/contact.ts` | Phone, address, hours, socials, form URL |
| `src/styles/theme.css` | Palette CSS variables |
| `src/styles/global.css` | Tailwind entry + theme import + resets |
| `src/assets/photos/*.jpg` | Compressed versions of `../Website Pics/` |
| `public/logo.svg` | Preserved from existing `public/images/logo-original.svg` |
| `public/favicon.svg` | New minimal favicon |
| `tests/render.test.ts` | Parse built `dist/index.html`, assert key invariants |
| `vitest.config.ts` | Vitest config |
| `docs/superpowers/plans/2026-04-15-lightweight-landing-implementation.md` | This plan |
| `docs/runbooks/cloudflare-pages-setup.md` | Manual-step runbook for CF Pages + DNS cutover |

**Files to delete** (entire v0 scaffold):
- `app/`, `components/` (top-level shadcn dir), `hooks/`, `lib/`, `scripts/sql/`, `styles/` (old)
- `auth.ts`, `components.json`, `next.config.mjs`, `postcss.config.mjs`, `MULTI_FILE_EDIT`
- `public/*.png`, `public/images/stock/`, `public/images/logo-ios-*.jpg` (keep only `logo-original.svg` as `public/logo.svg`)
- `pnpm-lock.yaml` (regenerated)

---

## Phase 0 — Cleanup

### Task 0: Nuke v0 scaffold

**Files:**
- Delete: `app/`, `components/`, `hooks/`, `lib/`, `scripts/`, `styles/`, `auth.ts`, `components.json`, `next.config.mjs`, `postcss.config.mjs`, `MULTI_FILE_EDIT`, `pnpm-lock.yaml`, `tsconfig.json`, `package.json`
- Move: `public/images/logo-original.svg` → `public/logo.svg`
- Delete: everything else in `public/`

- [ ] **Step 1: Preserve the logo**

```bash
cd /Users/mccune/_dev/SLAY/songbirds-life-academy
mkdir -p /tmp/slay-preserve
cp public/images/logo-original.svg /tmp/slay-preserve/logo.svg
```

- [ ] **Step 2: Delete v0 source and assets**

```bash
rm -rf app components hooks lib scripts styles public
rm -f auth.ts components.json next.config.mjs postcss.config.mjs MULTI_FILE_EDIT pnpm-lock.yaml tsconfig.json package.json
```

- [ ] **Step 3: Restore preserved logo**

```bash
mkdir -p public
cp /tmp/slay-preserve/logo.svg public/logo.svg
```

- [ ] **Step 4: Verify only expected files remain**

```bash
ls -la
```

Expected to see: `.git/`, `.gitignore`, `.superpowers/`, `CLAUDE.md`, `README.md`, `docs/`, `public/` (with just `logo.svg`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove v0 Next.js scaffold

Clean slate for Astro rewrite. Preserve only:
- docs/ (plan + spec)
- CLAUDE.md (project guidance, will be updated)
- public/logo.svg (from former public/images/logo-original.svg)"
```

---

## Phase 1 — Astro scaffold

### Task 1: Create package.json

**Files:**
- Create: `package.json`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "songbirds-life-academy",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "pnpm build && vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@tailwindcss/vite": "^4.1.0",
    "cheerio": "^1.0.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.5.0",
    "vitest": "^2.1.0"
  }
}
```

Note: `pnpm test` runs the build first, then vitest. The test file only reads `dist/index.html` — no child-process spawning inside the test itself.

- [ ] **Step 2: Install**

```bash
pnpm install
```

Expected: `node_modules/` populated, `pnpm-lock.yaml` created, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: initialize Astro + Tailwind v4 dependencies"
```

### Task 2: Create astro.config.mjs, tsconfig.json, and .gitignore additions

**Files:**
- Create: `astro.config.mjs`, `tsconfig.json`
- Modify: `.gitignore`

- [ ] **Step 1: Write astro.config.mjs**

```js
import {defineConfig} from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://songbirdslifeacademy.com',
  vite: {
    plugins: [tailwindcss()],
  },
})
```

- [ ] **Step 2: Write tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Append to .gitignore**

Open `.gitignore` and add these lines at the end:

```
# astro
dist/
.astro/
node_modules/
```

- [ ] **Step 4: Smoke test**

```bash
pnpm astro check --help
```

Expected: the command prints help without erroring. (There are no pages yet; this just verifies the CLI is wired up.)

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: configure Astro + Tailwind v4 + TS strict"
```

### Task 3: Global styles and theme

**Files:**
- Create: `src/styles/theme.css`, `src/styles/global.css`

- [ ] **Step 1: Write src/styles/theme.css**

```css
:root {
  --color-navy: #152846;
  --color-teal: #1f6e63;
  --color-cream: #f4ebd7;
  --color-cream-deep: #eadcb9;
  --color-gold: #d4a44a;
  --color-bronze: #b8864a;
  --color-burnt-orange: #c75a2e;
  --color-dark-red: #8b2e24;
  --color-wood: #3a2d1a;
  --color-ink: #1a1a1a;

  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --shadow-soft: 0 1px 2px rgba(21, 40, 70, 0.06), 0 2px 8px rgba(21, 40, 70, 0.04);
}
```

- [ ] **Step 2: Write src/styles/global.css**

```css
@import 'tailwindcss';
@import './theme.css';

@layer base {
  html {
    color: var(--color-navy);
    background: var(--color-cream);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0;
  }

  h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add theme variables + global styles"
```

### Task 4: Content modules

**Files:**
- Create: `src/content/contact.ts`, `src/content/copy.ts`

- [ ] **Step 1: Write src/content/contact.ts**

```ts
export const contact = {
  name: 'Songbirds Life Academy',
  tagline: 'Learning through play, immersed in music.',
  phone: '225.635.7973',
  phoneHref: 'tel:+12256357973',
  address: '5915 N. Commerce Street, St. Francisville, LA 70775',
  addressHref: 'https://maps.google.com/?q=5915+N.+Commerce+Street,+St.+Francisville,+LA+70775',
  hours: 'Mon–Fri 6:30AM – 5:30PM',
  hoursNote: 'Extended hours available upon request',
  instagram: 'https://instagram.com/songbirdslifeacademy',
  facebook: 'https://facebook.com/songbirdslifeacademy',
  handle: '@songbirdslifeacademy',
  inquiryFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScscInS8DxErCY4MZX4yDZicZjMDvmjrwzRfNmfNK4hGjQT3Q/viewform',
} as const
```

- [ ] **Step 2: Write src/content/copy.ts**

```ts
export const copy = {
  heroEyebrow: 'SONGBIRDS LIFE ACADEMY · ST. FRANCISVILLE, LA',
  heroHeadline: 'A joyful start, immersed in music.',
  heroBody:
    'Infant–Toddler care (6 weeks to 3 years) grounded in creativity, community, and research-based learning.',
  heroCta: 'Begin an inquiry',
  missionEyebrow: 'A STRONG START · A LASTING SONG',
  missionLead:
    'Through a community of creatives with deep roots and rich legacy, we build the early childhood education our town deserves.',
  missionBody: [
    'At Songbirds, we believe the earliest years are the most important. Our Infant–Toddler Program (ages 6 weeks to 3 years) nurtures each child\u2019s development through warm, responsive care and intentional learning experiences in a safe, loving environment.',
    'Music is at the core of our academy\u2019s philosophy. From soft lullabies that calm to clapping, humming, dancing, and instrumentation, music is used daily to support emotional bonding, language development, social growth, and motor skills.',
    'We proudly use The Creative Curriculum® for Infants, Toddlers & Twos, and Preschool, a research-based approach that transforms routines into learning moments. Our teachers guide development through play, movement, and meaningful interaction, building a strong foundation for lifelong learning.',
  ],
  highlightsEyebrow: 'PROGRAM HIGHLIGHTS',
  highlights: [
    {accent: 'burnt-orange', text: 'Low teacher-to-child ratios for personalized care'},
    {accent: 'teal', text: 'Music and movement activities every day'},
    {accent: 'gold', text: 'Sensory-rich classrooms that promote exploration'},
    {accent: 'navy', text: 'Daily communication and photo updates for families'},
  ],
  badges: [
    {icon: '\ud83c\udfdb\ufe0f', title: 'LA State', subtitle: 'Licensed'},
    {icon: '\ud83d\udcd8', title: 'Creative', subtitle: 'Curriculum®'},
    {icon: '\ud83c\udfbc', title: 'Music-', subtitle: 'Immersed'},
    {icon: '\ud83d\udcf1', title: 'Daily Photo', subtitle: 'Updates'},
  ],
  ctaHeadline:
    'Partner with us to give your child a joyful beginning where learning and love go hand in hand.',
  ctaButton: 'Begin an inquiry',
} as const
```

- [ ] **Step 3: Verify with astro check**

```bash
pnpm astro check
```

Expected: reports 0 errors, 0 warnings (or only "no pages found" level — we'll add pages next).

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add copy + contact content modules"
```

---

## Phase 2 — Shared layout

### Task 5: Base layout

**Files:**
- Create: `src/layouts/Base.astro`, `public/favicon.svg`

- [ ] **Step 1: Write src/layouts/Base.astro**

```astro
---
import '../styles/global.css'

interface Props {
  title?: string
  description?: string
}

const {
  title = 'Songbirds Life Academy — Infant & Toddler Care in St. Francisville, LA',
  description = 'Music-immersed infant & toddler care (6 weeks – 3 years) in St. Francisville, LA. Learning through play, grounded in The Creative Curriculum®.',
} = Astro.props
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap"
    />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Write public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#152846"/>
  <text x="16" y="22" font-family="Georgia, serif" font-size="18" font-weight="600" fill="#d4a44a" text-anchor="middle">S</text>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ public/favicon.svg
git commit -m "feat: base layout with fonts, meta, favicon"
```

### Task 6: Nav component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Write src/components/Nav.astro**

```astro
---
import {contact} from '../content/contact'
---

<nav class="nav">
  <a href="/" class="nav-brand">🎵 {contact.name.toUpperCase()}</a>
  <div class="nav-links">
    <a href="#about">About</a>
    <a href="#program">Program</a>
    <a href={contact.inquiryFormUrl} target="_blank" rel="noopener noreferrer" class="nav-cta">
      Inquire ↗
    </a>
  </div>
</nav>

<style>
  .nav {
    background: var(--color-navy);
    color: var(--color-cream);
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-sans);
    font-size: 13px;
    letter-spacing: 0.08em;
  }

  .nav-brand {
    font-weight: 600;
  }

  .nav-links {
    display: flex;
    gap: 18px;
    align-items: center;
  }

  .nav-cta {
    color: var(--color-gold);
    font-weight: 600;
  }

  @media (max-width: 520px) {
    .nav-links a:not(.nav-cta) {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: nav component"
```

### Task 7: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write src/components/Footer.astro**

```astro
---
import {contact} from '../content/contact'
---

<footer class="footer">
  <div class="row">
    <span class="icon">📞</span>
    <a href={contact.phoneHref}>{contact.phone}</a>
  </div>
  <div class="row">
    <span class="icon">📍</span>
    <a href={contact.addressHref} target="_blank" rel="noopener noreferrer">{contact.address}</a>
  </div>
  <div class="row">
    <span class="icon">🕒</span>
    <span>{contact.hours}</span>
    <span class="muted"> · {contact.hoursNote}</span>
  </div>
  <div class="row">
    <span class="icon">📷</span>
    <a href={contact.instagram} target="_blank" rel="noopener noreferrer">{contact.handle}</a>
    <span class="muted"> · Instagram</span>
    <span class="muted"> · </span>
    <a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-ink);
    color: var(--color-bronze);
    padding: 24px 22px;
    font-family: var(--font-sans);
    font-size: 13px;
    line-height: 1.9;
  }

  .footer a {
    color: var(--color-cream);
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .icon {
    margin-right: 6px;
  }

  .muted {
    color: var(--color-bronze);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: footer component"
```

---

## Phase 3 — Photos

### Task 8: Import and rename photos

**Files:**
- Create: `src/assets/photos/*.jpg` (6 files)

- [ ] **Step 1: Copy photos with semantic names**

```bash
cd /Users/mccune/_dev/SLAY/songbirds-life-academy
mkdir -p src/assets/photos
cp "../Website Pics/d8a27b87-f578-4b9e-a9a7-066517aaf1ae~1.jpg" src/assets/photos/drums-overhead.jpg
cp "../Website Pics/11070b50-5b1c-4080-b753-0845931a7698~1.jpg" src/assets/photos/piano-ribbons.jpg
cp "../Website Pics/a6d85c81-9bac-4acc-9ba0-5e22faee13b4~1.jpg" src/assets/photos/guitar-staff.jpg
cp "../Website Pics/0b9ee1d2-fbd0-4c46-bd20-5a32a8a4bbc1~1.jpg" src/assets/photos/train-play.jpg
cp "../Website Pics/15bfa375-7ac1-49bd-bd23-da2a2256920a~1.jpg" src/assets/photos/alphabet-mat.jpg
cp "../Website Pics/dcf3d87f-c049-42cc-bd72-65c88d911c55~1.jpg" src/assets/photos/piano-headphones.jpg
```

- [ ] **Step 2: Verify file sizes**

```bash
du -h src/assets/photos/*.jpg
```

Expected: all six files listed, each 1–3 MB (before Astro's build-time compression).

- [ ] **Step 3: Commit**

```bash
git add src/assets/photos/
git commit -m "feat: add classroom photos as Astro assets

Astros image pipeline (astro:assets) will convert these to WebP
and size-optimize them at build time."
```

**Note on compression:** Astro's `astro:assets` `<Image>` component applies optimization and modern-format conversion at build time. We do not pre-compress — we let the build pipeline do it.

---

## Phase 4 — Page sections

### Task 9: Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write src/components/Hero.astro**

```astro
---
import {copy} from '../content/copy'
import {contact} from '../content/contact'
---

<section class="hero">
  <div class="eyebrow">{copy.heroEyebrow}</div>
  <h1 class="headline">
    A joyful start, <em>immersed in music.</em>
  </h1>
  <p class="body">{copy.heroBody}</p>
  <div class="ctas">
    <a
      class="cta-primary"
      href={contact.inquiryFormUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {copy.heroCta} ↗
    </a>
    <a class="cta-secondary" href={contact.phoneHref}>📞 {contact.phone}</a>
  </div>
</section>

<style>
  .hero {
    padding: 44px 22px 32px;
    background: linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-deep) 100%);
  }

  .eyebrow {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.25em;
    color: #7a5a1a;
  }

  .headline {
    font-family: var(--font-serif);
    font-size: clamp(28px, 6vw, 44px);
    line-height: 1.15;
    color: var(--color-navy);
    margin: 12px 0 0;
    font-weight: 500;
  }

  .headline em {
    color: var(--color-teal);
    font-style: italic;
  }

  .body {
    font-family: var(--font-sans);
    color: #3a3a2a;
    max-width: 36rem;
    margin: 14px 0 0;
  }

  .ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;
  }

  .cta-primary, .cta-secondary {
    font-family: var(--font-sans);
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 4px;
    display: inline-block;
  }

  .cta-primary {
    background: var(--color-navy);
    color: var(--color-cream);
    font-weight: 600;
  }

  .cta-secondary {
    border: 1.5px solid var(--color-navy);
    color: var(--color-navy);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: hero component"
```

### Task 10: PhotoBand component

**Files:**
- Create: `src/components/PhotoBand.astro`

- [ ] **Step 1: Write src/components/PhotoBand.astro**

```astro
---
import {Image} from 'astro:assets'
import drums from '../assets/photos/drums-overhead.jpg'
---

<section class="band">
  <Image
    src={drums}
    alt="Overhead view of a young child playing a drum kit in the Songbirds classroom"
    widths={[480, 768, 1200, 1600]}
    sizes="100vw"
    format="webp"
    quality={78}
  />
  <div class="tint"></div>
</section>

<style>
  .band {
    position: relative;
    overflow: hidden;
  }

  .band :global(img) {
    width: 100%;
    height: auto;
    display: block;
    filter: brightness(0.88) saturate(0.92);
  }

  .tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(21, 40, 70, 0) 0%, rgba(21, 40, 70, 0.12) 100%);
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PhotoBand.astro
git commit -m "feat: full-bleed photo band component"
```

### Task 11: MissionStory component

**Files:**
- Create: `src/components/MissionStory.astro`

- [ ] **Step 1: Write src/components/MissionStory.astro**

```astro
---
import {copy} from '../content/copy'
---

<section id="about" class="mission">
  <div class="eyebrow">{copy.missionEyebrow}</div>
  <h2 class="lead">{copy.missionLead}</h2>
  <div class="rule"></div>
  {copy.missionBody.map((paragraph) => <p class="para">{paragraph}</p>)}
</section>

<style>
  .mission {
    padding: 36px 22px;
    background: var(--color-cream);
  }

  .eyebrow {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--color-bronze);
  }

  .lead {
    font-family: var(--font-serif);
    font-size: clamp(20px, 4.2vw, 28px);
    color: var(--color-navy);
    line-height: 1.3;
    margin: 10px 0 0;
    font-weight: 500;
    max-width: 34rem;
  }

  .rule {
    width: 60px;
    height: 1px;
    background: var(--color-bronze);
    margin: 20px 0;
  }

  .para {
    font-family: var(--font-serif);
    color: #2a2a2a;
    font-size: 15px;
    line-height: 1.7;
    max-width: 36rem;
    margin: 0 0 14px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MissionStory.astro
git commit -m "feat: mission + story section"
```

### Task 12: PhotoStrip component

**Files:**
- Create: `src/components/PhotoStrip.astro`

- [ ] **Step 1: Write src/components/PhotoStrip.astro**

```astro
---
import {Image} from 'astro:assets'
import piano from '../assets/photos/piano-ribbons.jpg'
import guitar from '../assets/photos/guitar-staff.jpg'
---

<section class="strip">
  <div class="left">
    <Image
      src={piano}
      alt="Two children sitting at a piano holding colorful ribbon streamers, smiling"
      widths={[400, 800, 1200]}
      sizes="(max-width: 768px) 66vw, 66vw"
      format="webp"
      quality={80}
    />
  </div>
  <div class="right">
    <Image
      src={guitar}
      alt="A Songbirds staff member with a guitar in front of the SLAY logo and state education licenses"
      widths={[300, 600, 900]}
      sizes="(max-width: 768px) 33vw, 33vw"
      format="webp"
      quality={80}
    />
  </div>
</section>

<style>
  .strip {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 6px;
    padding: 0 22px;
  }

  .strip :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .left, .right {
    aspect-ratio: 4/3;
    overflow: hidden;
    border-radius: 4px;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PhotoStrip.astro
git commit -m "feat: asymmetric two-photo strip"
```

### Task 13: Highlights component

**Files:**
- Create: `src/components/Highlights.astro`

- [ ] **Step 1: Write src/components/Highlights.astro**

```astro
---
import {copy} from '../content/copy'

const accentVar = {
  'burnt-orange': 'var(--color-burnt-orange)',
  'teal': 'var(--color-teal)',
  'gold': 'var(--color-gold)',
  'navy': 'var(--color-navy)',
} as const
---

<section id="program" class="highlights">
  <div class="eyebrow">{copy.highlightsEyebrow}</div>
  <ul class="grid">
    {copy.highlights.map((item) => (
      <li class="card" style={`--accent:${accentVar[item.accent]}`}>
        <span class="text">{item.text}</span>
      </li>
    ))}
  </ul>
</section>

<style>
  .highlights {
    padding: 28px 22px;
  }

  .eyebrow {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--color-bronze);
  }

  .grid {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .card {
    background: #fff;
    border-left: 3px solid var(--accent);
    padding: 14px 16px;
    box-shadow: var(--shadow-soft);
    border-radius: 2px;
  }

  .text {
    font-family: var(--font-sans);
    font-size: 14px;
    color: #2a2a2a;
    line-height: 1.5;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Highlights.astro
git commit -m "feat: program highlights grid"
```

### Task 14: TrustBadges component

**Files:**
- Create: `src/components/TrustBadges.astro`

- [ ] **Step 1: Write src/components/TrustBadges.astro**

```astro
---
import {copy} from '../content/copy'
---

<section class="badges">
  {copy.badges.map((badge) => (
    <div class="badge">
      <div class="icon">{badge.icon}</div>
      <div class="title">{badge.title}</div>
      <div class="subtitle">{badge.subtitle}</div>
    </div>
  ))}
</section>

<style>
  .badges {
    background: var(--color-cream-deep);
    padding: 20px 22px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    font-family: var(--font-sans);
    text-align: center;
  }

  @media (max-width: 480px) {
    .badges {
      grid-template-columns: 1fr 1fr;
    }
  }

  .badge {
    font-size: 11px;
    color: #2a2a2a;
    line-height: 1.4;
  }

  .icon {
    font-size: 22px;
    margin-bottom: 4px;
  }

  .title {
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TrustBadges.astro
git commit -m "feat: trust badge strip"
```

### Task 15: CtaBand component

**Files:**
- Create: `src/components/CtaBand.astro`

- [ ] **Step 1: Write src/components/CtaBand.astro**

```astro
---
import {copy} from '../content/copy'
import {contact} from '../content/contact'
---

<section class="cta-band">
  <p class="headline">{copy.ctaHeadline}</p>
  <a
    class="button"
    href={contact.inquiryFormUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    {copy.ctaButton} ↗
  </a>
</section>

<style>
  .cta-band {
    padding: 40px 22px;
    background: var(--color-navy);
    color: var(--color-cream);
    text-align: center;
  }

  .headline {
    font-family: var(--font-serif);
    font-size: clamp(18px, 4vw, 22px);
    line-height: 1.4;
    max-width: 38rem;
    margin: 0 auto;
    font-weight: 500;
  }

  .button {
    display: inline-block;
    margin-top: 20px;
    background: var(--color-burnt-orange);
    color: var(--color-cream);
    padding: 12px 26px;
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CtaBand.astro
git commit -m "feat: CTA band component"
```

### Task 16: Compose index.astro

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write src/pages/index.astro**

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Hero from '../components/Hero.astro'
import PhotoBand from '../components/PhotoBand.astro'
import MissionStory from '../components/MissionStory.astro'
import PhotoStrip from '../components/PhotoStrip.astro'
import Highlights from '../components/Highlights.astro'
import TrustBadges from '../components/TrustBadges.astro'
import CtaBand from '../components/CtaBand.astro'
import Footer from '../components/Footer.astro'
---

<Base>
  <Nav />
  <Hero />
  <PhotoBand />
  <MissionStory />
  <PhotoStrip />
  <Highlights />
  <TrustBadges />
  <CtaBand />
  <Footer />
</Base>
```

- [ ] **Step 2: Run the dev server**

```bash
pnpm dev
```

Expected: Astro starts at http://localhost:4321. Open in a browser and scroll through the page. All sections should render, all photos should load, the Inquire button should link to the Google Form.

- [ ] **Step 3: Stop the dev server** (Ctrl+C)

- [ ] **Step 4: Run the production build**

```bash
pnpm build
```

Expected: Build succeeds. `dist/index.html` exists. `dist/_astro/` contains optimized WebP copies of the six photos. Console lists each asset with its final size.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: compose homepage from section components"
```

---

## Phase 5 — Tests

### Task 17: Integration test on built output

**Files:**
- Create: `vitest.config.ts`, `tests/render.test.ts`

The test reads `dist/index.html` directly. The build step is run by the `pnpm test` script (defined in Task 1's `package.json`), not from inside the test file — this avoids spawning child processes from within the test code.

- [ ] **Step 1: Write vitest.config.ts**

```ts
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
```

- [ ] **Step 2: Write tests/render.test.ts**

```ts
import {describe, it, expect, beforeAll} from 'vitest'
import {readFileSync, existsSync} from 'node:fs'
import {load} from 'cheerio'

let $: ReturnType<typeof load>

beforeAll(() => {
  const distIndex = 'dist/index.html'

  if (!existsSync(distIndex)) {
    throw new Error(`${distIndex} missing — run "pnpm build" before "vitest run". The "pnpm test" script does this automatically.`)
  }

  const html = readFileSync(distIndex, 'utf8')
  $ = load(html)
})

describe('rendered index.html', () => {
  it('contains the tagline', () => {
    expect($('body').text()).toContain('immersed in music')
  })

  it('links to the Google inquiry form, opening in a new tab with rel noopener', () => {
    const forms = $('a[href*="docs.google.com/forms"]')

    expect(forms.length).toBeGreaterThanOrEqual(1)

    forms.each((_, el) => {
      expect($(el).attr('target')).toBe('_blank')
      expect($(el).attr('rel')).toMatch(/noopener/)
    })
  })

  it('has a tap-to-call phone link', () => {
    const tel = $('a[href^="tel:"]')

    expect(tel.length).toBeGreaterThanOrEqual(1)
    expect(tel.first().attr('href')).toBe('tel:+12256357973')
  })

  it('renders all four program highlights', () => {
    const bodyText = $('body').text()

    expect(bodyText).toContain('Low teacher-to-child ratios')
    expect(bodyText).toContain('Music and movement activities every day')
    expect(bodyText).toContain('Sensory-rich classrooms')
    expect(bodyText).toContain('Daily communication and photo updates')
  })

  it('has alt text on every image', () => {
    $('img').each((_, el) => {
      const alt = $(el).attr('alt')
      expect(alt, `img missing alt: ${$(el).attr('src')}`).toBeTruthy()
    })
  })

  it('surfaces the state license trust badge', () => {
    expect($('body').text()).toContain('LA State')
  })
})
```

- [ ] **Step 3: Run the tests**

```bash
pnpm test
```

Expected: `pnpm build` completes, then all six vitest assertions pass. If any fail, inspect the failure and fix the corresponding component — the failing test is telling you the rendered output doesn't match a spec requirement.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/render.test.ts
git commit -m "test: integration tests for rendered index.html"
```

---

## Phase 6 — Cloudflare Pages setup

### Task 18: Create CF Pages project via Wrangler

**Files:**
- Create: `docs/runbooks/cloudflare-pages-setup.md`

This task contains manual steps requiring Cloudflare account access. If the implementer does not have access, skip to Task 19 and leave Task 18 for the repo owner to execute using the runbook.

- [ ] **Step 1: Install Wrangler globally (once)**

```bash
pnpm add -g wrangler
wrangler --version
```

Expected: version 3.x or later.

- [ ] **Step 2: Authenticate**

```bash
wrangler login
```

This opens a browser for OAuth. Complete the flow.

- [ ] **Step 3: Create the Pages project**

```bash
wrangler pages project create songbirds-life-acadamy \
  --production-branch main \
  --compatibility-date 2026-04-15
```

Expected: project created, output includes the `.pages.dev` subdomain: `https://songbirds-life-acadamy.pages.dev`. *(Project name intentionally matches the repo — with the "acadamy" typo preserved.)*

- [ ] **Step 4: Connect the GitHub repo via the Cloudflare dashboard**

Open https://dash.cloudflare.com/ → Workers & Pages → `songbirds-life-acadamy` → Settings → Builds & deployments → Source → Connect to Git. Select:
- Repository: `michael-collective-works/songbirds-life-acadamy`
- Production branch: `main`
- Framework preset: **Astro**
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/` (leave default)

This cannot be scripted via Wrangler today — it's a dashboard-only step.

- [ ] **Step 5: Write docs/runbooks/cloudflare-pages-setup.md**

```markdown
# Cloudflare Pages Setup Runbook

Manual steps required to host this site on Cloudflare Pages. Re-run from scratch if the project needs to be rebuilt.

## Prerequisites

- A Cloudflare account (free tier is fine)
- Access to GoDaddy DNS for `songbirdslifeacademy.com`
- `wrangler` CLI installed: `pnpm add -g wrangler`

## 1. Create the Pages project

```bash
wrangler login
wrangler pages project create songbirds-life-acadamy \
  --production-branch main \
  --compatibility-date 2026-04-15
```

Output gives you `https://songbirds-life-acadamy.pages.dev`.

## 2. Connect the GitHub repo (dashboard)

Open https://dash.cloudflare.com → Workers & Pages → `songbirds-life-acadamy` → Settings → Builds & deployments → Source → Connect to Git.

- Repo: `michael-collective-works/songbirds-life-acadamy`
- Production branch: `main`
- Framework preset: Astro
- Build command: `pnpm build`
- Output directory: `dist`

## 3. Trigger the first deploy

Push any commit to `main`. Watch the deploy at Workers & Pages → songbirds-life-acadamy → Deployments. First deploy takes 1–3 minutes.

Verify: visit `https://songbirds-life-acadamy.pages.dev`. The page renders.

## 4. Branch previews (automatic)

For every non-`main` branch pushed to GitHub, Cloudflare auto-deploys a preview at:

```
https://<branch-name>.songbirds-life-acadamy.pages.dev
```

No extra configuration. Dashes in branch names are preserved; slashes become dashes.

## 5. Custom domain cutover (only after owner selects a winner)

**Only do this after the winning variant is merged to `main` and verified working on `*.pages.dev`.**

### 5a. Add the domain in Cloudflare Pages

Workers & Pages → songbirds-life-acadamy → Custom domains → Set up a custom domain → enter `songbirdslifeacademy.com` and `www.songbirdslifeacademy.com`.

Cloudflare will show the required DNS records. For domains whose DNS is managed elsewhere (GoDaddy in our case), it typically asks you to create:

- `CNAME www -> songbirds-life-acadamy.pages.dev`
- For the apex (`@`): if the registrar supports CNAME flattening/ALIAS, `CNAME @ -> songbirds-life-acadamy.pages.dev`. Otherwise Cloudflare provides specific `A`/`AAAA` records to use instead.

### 5b. Add records at GoDaddy

Log into GoDaddy → My Products → Domains → songbirdslifeacademy.com → DNS → Manage Zones. Add the records Cloudflare provided. **Leave MX records alone** — those route email and must not change.

### 5c. Verify propagation

```bash
dig songbirdslifeacademy.com
dig www.songbirdslifeacademy.com
```

Wait 5–30 minutes, then visit `https://songbirdslifeacademy.com`. You should see the new site with a valid TLS certificate (Cloudflare provisions this automatically).

### 5d. Cancel GoDaddy hosting plan

Once the custom domain resolves to the Cloudflare-hosted site and has been verified for 48 hours, log into GoDaddy and cancel any *hosting* plan (cPanel, Website Builder, etc.). Keep the *domain registration* — that's separate.

## 6. Optional: Cloudflare Web Analytics

Workers & Pages → songbirds-life-acadamy → Analytics → Enable Web Analytics. Copy the provided snippet into `src/layouts/Base.astro` inside `<head>` if desired.
```

- [ ] **Step 6: Commit the runbook**

```bash
git add docs/runbooks/cloudflare-pages-setup.md
git commit -m "docs: Cloudflare Pages + DNS cutover runbook"
```

### Task 19: Push main and verify first deploy

- [ ] **Step 1: Push main**

```bash
git push origin main
```

- [ ] **Step 2: Watch the deploy**

Open Cloudflare dashboard → Workers & Pages → `songbirds-life-acadamy` → Deployments. Wait for the first build to complete (green checkmark).

Expected: build log shows `pnpm build` running, the final "Deployed" line prints the URL. Total time: ~2 minutes.

- [ ] **Step 3: Verify the production URL**

```bash
curl -sI https://songbirds-life-acadamy.pages.dev | head -5
```

Expected: `HTTP/2 200`. Visit in a browser and scroll through.

---

## Phase 7 — Variant branches

### Task 20: Create the calm-creative variant branch

The design captured in this plan *is* the calm-creative variant (it's the baseline). So this branch simply mirrors `main` at the current commit.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b variant/calm-creative
git push -u origin variant/calm-creative
```

- [ ] **Step 2: Verify the preview URL**

Wait for the CF deploy, then:

```bash
curl -sI https://variant-calm-creative.songbirds-life-acadamy.pages.dev | head -5
```

Expected: `HTTP/2 200`.

- [ ] **Step 3: Return to main**

```bash
git checkout main
```

### Task 21: Create the warm-story variant branch

This variant swaps the palette to softer cream + amber tones, and uses a more rounded serif (Cormorant Garamond instead of Fraunces).

**Files (on this branch only):**
- Modify: `src/styles/theme.css`
- Modify: `src/layouts/Base.astro` (font link)

- [ ] **Step 1: Branch from main**

```bash
git checkout -b variant/warm-story main
```

- [ ] **Step 2: Rewrite src/styles/theme.css with warm-story palette**

```css
:root {
  --color-navy: #3d2a14;
  --color-teal: #8a6a3a;
  --color-cream: #f9f0da;
  --color-cream-deep: #f3e4bf;
  --color-gold: #c59a46;
  --color-bronze: #a47a3a;
  --color-burnt-orange: #d08a4a;
  --color-dark-red: #a04a30;
  --color-wood: #4a3820;
  --color-ink: #2a1f10;

  --font-serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --shadow-soft: 0 1px 2px rgba(61, 42, 20, 0.06), 0 2px 8px rgba(61, 42, 20, 0.04);
}
```

- [ ] **Step 3: Update the Google Fonts link in src/layouts/Base.astro**

Replace the `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` line with:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&display=swap"
/>
```

- [ ] **Step 4: Run the build**

```bash
pnpm build && pnpm test
```

Expected: build succeeds, all six tests still pass. (The tests assert content, not palette, so they should remain green.)

- [ ] **Step 5: Commit and push**

```bash
git add src/styles/theme.css src/layouts/Base.astro
git commit -m "feat(variant): warm-story palette and typography"
git push -u origin variant/warm-story
```

- [ ] **Step 6: Verify preview URL**

```bash
curl -sI https://variant-warm-story.songbirds-life-acadamy.pages.dev | head -5
```

Expected: `HTTP/2 200` after CF builds (~2 min).

- [ ] **Step 7: Return to main**

```bash
git checkout main
```

### Task 22: Create the music-forward variant branch

This variant leads with the drums photo as a full-height hero, uses the boldest palette (saturated yellow + deep teal + brick red), and uses Playfair Display for more magazine-like headlines.

**Files (on this branch only):**
- Modify: `src/styles/theme.css`
- Modify: `src/layouts/Base.astro` (font link)
- Modify: `src/components/Hero.astro` (swap hero to use drums photo full-bleed behind text)
- Modify: `src/pages/index.astro` (remove the separate `PhotoBand` since drums is now the hero)

- [ ] **Step 1: Branch from main**

```bash
git checkout -b variant/music-forward main
```

- [ ] **Step 2: Rewrite src/styles/theme.css with music-forward palette**

```css
:root {
  --color-navy: #0f1a2e;
  --color-teal: #0e5e55;
  --color-cream: #fff8d8;
  --color-cream-deep: #f4e1a6;
  --color-gold: #f2c94c;
  --color-bronze: #b88a2a;
  --color-burnt-orange: #c0392b;
  --color-dark-red: #7a1f16;
  --color-wood: #2c2c2c;
  --color-ink: #0a0a0a;

  --font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --shadow-soft: 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

- [ ] **Step 3: Update the Google Fonts link in src/layouts/Base.astro**

Replace the `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` line with:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap"
/>
```

- [ ] **Step 4: Rewrite src/components/Hero.astro to use drums photo full-bleed**

```astro
---
import {Image} from 'astro:assets'
import {copy} from '../content/copy'
import {contact} from '../content/contact'
import drums from '../assets/photos/drums-overhead.jpg'
---

<section class="hero">
  <Image
    src={drums}
    alt="Overhead view of a young child playing a drum kit in the Songbirds classroom"
    widths={[480, 768, 1200, 1600]}
    sizes="100vw"
    format="webp"
    quality={78}
    class="bg"
  />
  <div class="scrim"></div>
  <div class="content">
    <div class="eyebrow">{copy.heroEyebrow}</div>
    <h1 class="headline">A joyful start, <em>immersed in music.</em></h1>
    <p class="body">{copy.heroBody}</p>
    <div class="ctas">
      <a
        class="cta-primary"
        href={contact.inquiryFormUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {copy.heroCta} ↗
      </a>
      <a class="cta-secondary" href={contact.phoneHref}>📞 {contact.phone}</a>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 72vh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
    color: var(--color-cream);
  }

  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.55) saturate(1.1);
    z-index: 0;
  }

  .scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(15, 26, 46, 0.25) 0%,
      rgba(15, 26, 46, 0.7) 85%
    );
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 32px 22px 44px;
    width: 100%;
    max-width: 42rem;
  }

  .eyebrow {
    font-family: var(--font-sans);
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--color-gold);
  }

  .headline {
    font-family: var(--font-serif);
    font-size: clamp(32px, 7vw, 52px);
    line-height: 1.1;
    color: var(--color-cream);
    margin: 12px 0 0;
    font-weight: 700;
  }

  .headline em {
    color: var(--color-gold);
    font-style: italic;
    font-weight: 500;
  }

  .body {
    font-family: var(--font-sans);
    color: var(--color-cream);
    margin: 14px 0 0;
    max-width: 34rem;
    line-height: 1.5;
  }

  .ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 22px;
  }

  .cta-primary {
    background: var(--color-burnt-orange);
    color: var(--color-cream);
    padding: 12px 24px;
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 600;
  }

  .cta-secondary {
    border: 1.5px solid var(--color-cream);
    color: var(--color-cream);
    padding: 12px 22px;
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 14px;
  }
</style>
```

- [ ] **Step 5: Remove the now-duplicate PhotoBand in src/pages/index.astro**

Replace the body of `src/pages/index.astro` with:

```astro
---
import Base from '../layouts/Base.astro'
import Nav from '../components/Nav.astro'
import Hero from '../components/Hero.astro'
import MissionStory from '../components/MissionStory.astro'
import PhotoStrip from '../components/PhotoStrip.astro'
import Highlights from '../components/Highlights.astro'
import TrustBadges from '../components/TrustBadges.astro'
import CtaBand from '../components/CtaBand.astro'
import Footer from '../components/Footer.astro'
---

<Base>
  <Nav />
  <Hero />
  <MissionStory />
  <PhotoStrip />
  <Highlights />
  <TrustBadges />
  <CtaBand />
  <Footer />
</Base>
```

- [ ] **Step 6: Build + test**

```bash
pnpm build && pnpm test
```

Expected: build succeeds, tests pass.

- [ ] **Step 7: Commit and push**

```bash
git add src/styles/theme.css src/layouts/Base.astro src/components/Hero.astro src/pages/index.astro
git commit -m "feat(variant): music-forward hero + palette + typography"
git push -u origin variant/music-forward
```

- [ ] **Step 8: Verify preview URL**

```bash
curl -sI https://variant-music-forward.songbirds-life-acadamy.pages.dev | head -5
```

Expected: `HTTP/2 200` after CF builds.

- [ ] **Step 9: Return to main**

```bash
git checkout main
```

### Task 23: Send variant URLs to owner

- [ ] **Step 1: Confirm all three preview URLs load**

```bash
for branch in calm-creative warm-story music-forward; do
  echo "=== $branch ==="
  curl -sI "https://variant-${branch}.songbirds-life-acadamy.pages.dev" | head -3
done
```

Expected: each prints `HTTP/2 200`.

- [ ] **Step 2: Draft the owner-facing message**

Write it as a note for the human operator, not as code. Something like:

> Hi — three visual options for the new site, all built from the same content. Tap through and let me know which one feels right. You can view them on your phone.
>
> - **Calm Creative** (navy + bronze + cream, serif headlines): https://variant-calm-creative.songbirds-life-acadamy.pages.dev
> - **Warm Story** (softer amber palette, literary serif): https://variant-warm-story.songbirds-life-acadamy.pages.dev
> - **Music Forward** (bold, photo-led hero, magazine feel): https://variant-music-forward.songbirds-life-acadamy.pages.dev
>
> Nothing is live on your real website yet — these are preview links only.

---

## Phase 8 — Post-selection cutover (gated)

### Task 24: Merge winning variant to main

**Gated on:** owner selecting a variant. Ask the user which variant before proceeding.

- [ ] **Step 1: Check out main and merge the winner** (replace `<winner>` with the selected branch name)

```bash
git checkout main
git merge --no-ff variant/<winner> -m "feat: adopt <winner> as production design"
git push origin main
```

- [ ] **Step 2: Watch the production deploy**

Cloudflare dashboard → Deployments → confirm `main` deploy completes green.

- [ ] **Step 3: Delete the losing branches**

```bash
for branch in calm-creative warm-story music-forward; do
  if [ "$branch" != "<winner>" ]; then
    git push origin --delete "variant/$branch"
    git branch -D "variant/$branch"
  fi
done
```

Keep the winner's variant branch around for one release cycle in case of revert, then delete.

### Task 25: Custom domain cutover

**Gated on:** owner confirming she's ready to point the live domain at the new site.

Follow the runbook written in Task 18 Step 5. Summarized here for convenience:

- [ ] **Step 1: Add custom domains in Cloudflare Pages dashboard**

Workers & Pages → songbirds-life-acadamy → Custom domains → add `songbirdslifeacademy.com` and `www.songbirdslifeacademy.com`. Cloudflare shows the exact DNS records required.

- [ ] **Step 2: Add records at GoDaddy**

GoDaddy → DNS → Manage zones for `songbirdslifeacademy.com`. Add the records Cloudflare provided. **Do not touch MX records.**

- [ ] **Step 3: Verify**

```bash
dig songbirdslifeacademy.com
dig www.songbirdslifeacademy.com
```

Wait up to 30 minutes for propagation. Then visit `https://songbirdslifeacademy.com` in a browser and confirm:
- New site renders
- TLS padlock is green (Cloudflare-issued cert)
- Both apex and `www` resolve

- [ ] **Step 4: Advise owner to cancel GoDaddy hosting plan**

After 48 hours of stable operation, she can cancel any active *hosting* plan at GoDaddy (cPanel, Website Builder, etc.). The *domain registration* stays.

---

## Self-Review (performed by plan author)

**Spec coverage:**
- Architecture stack (Astro + CF Pages + Tailwind v4 + Google Fonts) -> Tasks 1, 2, 3, 5
- Non-goals (no CMS/auth/DB/uploads) -> Task 0 (nukes all of it)
- Layout 1-9 (nav, hero, photo band, mission, strip, highlights, badges, CTA, footer) -> Tasks 6, 9, 10, 11, 12, 13, 14, 15, 7 (in that order), composed in Task 16
- Palette tokens -> Task 3 (baseline) + Tasks 21, 22 (variants)
- Content verbatim -> Task 4
- Photo mapping -> Task 8 + used in Tasks 10, 12, 22
- Three variants -> Tasks 20, 21, 22
- Preview URLs for owner -> Task 23
- DNS cutover + runbook -> Tasks 18, 25
- $0 cost + cancel GoDaddy hosting -> Task 25 Step 4
- Success criteria (Lighthouse >= 95, TLS, all variants deployed) -> achieved by the combined workflow; tests in Task 17 assert content correctness; Lighthouse is verified manually against the preview URLs

**Placeholder scan:** no "TBD", "TODO", or "add appropriate X" entries. Every code block shows exact code. Every shell command shows expected output.

**Type consistency:** `contact.inquiryFormUrl`, `contact.phoneHref`, `contact.phone`, `copy.heroCta`, `copy.ctaButton`, `copy.highlights[].accent`, `copy.badges[].icon` — all defined in Task 4 and referenced with the same names in Tasks 6, 9, 11, 13, 14, 15. Accent keys (`burnt-orange`, `teal`, `gold`, `navy`) are the same set in Task 4 content and Task 13 lookup map.

**Open spec questions handled:**
- Fourth trust badge: resolved as "Daily Photo Updates" in `copy.ts` (Task 4).
- Serif font choice: Fraunces for calm-creative, Cormorant Garamond for warm-story, Playfair Display for music-forward (one per variant).
- Existing GoDaddy site: Task 25 Step 4 calls out that the *hosting plan* can be canceled after verification; *domain* stays.
