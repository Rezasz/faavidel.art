# Painterly Redesign — faavidel.art

**Date:** 2026-04-29
**Status:** Design — pending user review
**Supersedes:** the visual layer of `docs/superpowers/specs/2026-04-26-faavidel-art-design.md` (information architecture, routing, admin, infrastructure all stay)

---

## Motivation

The current site uses a flat ocean/seafoam palette and generic Tailwind sans/serif fonts. The artist (Faezeh Ghavidel / Faavidel) is a multidisciplinary painter and motion artist whose work is dense, emotional and painterly. The site does not look like her.

This redesign replaces the entire visual layer so every page looks and feels like one of her paintings — without rebuilding the underlying app.

**Out of scope:** routing, admin features, content APIs, Stripe, Resend, NextAuth, Blob storage. Only the visual layer and gallery seed change.

---

## Reference

Source painting (the brief): `~/Downloads/IMG_2940.jpg` — soft-watercolor sky with three orbital suns, indigo mountains and serpentine paths.

Live works (used as content + atmosphere): 18 paintings exhibited at World Art Dubai 2026, captured to `scripts/artworks-wad2026.json`.

---

## Visual system

### Palette

Extracted from the reference painting + verified across the WAD works.

| Token | Hex | Use |
|---|---|---|
| `iris` | `#6B5BA8` | wash, ambient |
| `indigo` | `#3B4FB0` | wash, deep accents |
| `lilac` | `#9D7EC8` | wash, mid-tone |
| `coral` | `#E89B7C` | accent, warm wash |
| `amber` | `#E8B86F` | orbs, active state, painted accents (primary highlight) |
| `rose` | `#D86E78` | wash, hover |
| `cream` | `#FBE7D0` | text, cream surfaces, light brushstrokes |
| `night` | `#0E0A1C` | base background under hero/dark contexts |
| `parchment` | `#FBF7EE` | admin work surfaces, light section backgrounds |

Tailwind v3: extend `theme.colors.brand` with these tokens. Existing `ocean`/`seafoam`/`charcoal` are removed.

### Typography

| Role | Font | Notes |
|---|---|---|
| Display headings | **Cormorant Garamond Italic** 500 | hero, section titles, painting titles |
| Body | **Cormorant Garamond** 400 | writing essays, longform |
| Eyebrows / labels / nav / meta | **IBM Plex Mono** 400, uppercase, `letter-spacing: 0.25em–0.4em` | navigation, "№ 08 / 18", scene labels |
| UI (admin tables, inputs) | **IBM Plex Mono** 400 13px | quick scan-ability |

Loaded via `next/font/google`. No FOUT — preload the two families in `app/layout.tsx`.

### Motion vocabulary (the "atmospheric layer")

A single component, `<AtmosphericLayer />`, renders behind every page. It is composed of:

1. **Painting Ken-Burns crossfade** — three painting URLs cycled every ~10s with a slow scale+translate. Slot 0 fades up, slot 1 fades up, slot 2 fades up, repeat.
2. **Edge-bleed via SVG turbulence + displacement** — `feTurbulence` (animated `baseFrequency`) + `feDisplacementMap` applied to each painting layer. Edges dissolve organically into the page.
3. **Painted brushstroke overlay** — five SVG `<path>` curves with `stroke-dasharray` animation that paint themselves on, hold, fade out, repeat (8s loop, staggered). Strokes use `feTurbulence` for organic edges. Cream/amber/rose colors.
4. **Vignette + film grain** — radial darkening + SVG noise overlay (`mix-blend-mode: overlay`).
5. **Ringed pulsing orbs** — 1–3 orbs per page, sized contextually. Radial-gradient core, two rotating ring auras (one solid 12s, one dashed 18s reverse), 5s pulse.
6. **Painted underline** — under hero/section titles. Animated SVG hand-drawn curve drawing left-to-right.

The same component takes props for: which paintings to cycle (defaults to a curated 3-painting sequence), darken intensity, and orb count.

### Reduced motion

When `prefers-reduced-motion: reduce`:
- No Ken-Burns transform, no crossfade — show one static painting.
- No turbulence animation.
- Brushstrokes draw once on mount, then stay; no repeating loop.
- No orb pulse, no ring rotation.

---

## Page-by-page treatment

### `/` — Home

Full-bleed hero (100vh). `<AtmosphericLayer />` cycles 3 hero paintings (Reflection of a star → What color is "getting rid of stifling" → Introspection). Hero text: artist name eyebrow, italic title quote, painted underline, three meta stats. Top nav floats over the hero in Plex Mono.

Below the fold:
- **Featured paintings** — 3 large cards in a horizontal scroller, each with edge-bleed thumbnail, Cormorant title, year. Hover: amber painted underline draws under the title.
- **Words** — 2 essay cards in a 2-up grid, italic Cormorant title.
- **Bio teaser** — Cormorant body, painted divider above and below.

### `/gallery` (paintings index)

`<AtmosphericLayer />` continues but darker (intensity 0.65) so cards stand out. Painting grid: irregular masonry, each card has:
- Bleeding thumbnail (turbulence filter)
- Italic Cormorant title
- Plex Mono meta (`№ XX / 18`, year)
- On hover: amber painted underline animates in, brushstroke border fades over the card edge

Tag filter chips in Plex Mono uppercase.

### `/gallery/[slug]` (single painting)

Hero: full painting at 100vh, edge-bleeding into the page. Below: Cormorant italic title, Plex Mono meta, body description. Two ringed orbs flanking the title at small size. "Other paintings" rail at bottom.

### `/photography` and `/photography/[series]`

Same atmospheric layer; lighter darken. Series cards mirror the painting cards. Lightbox: the painted vignette + orb appear at viewer corners; close button is a Plex Mono "× CLOSE".

### `/writing` and `/writing/[slug]`

`<AtmosphericLayer />` set to a parchment-light variant: cream base, lower-opacity painting wash, no orbs in body area. Single-column reading column 65ch. Cormorant body 18px / 1.6. Markdown renders with painted dividers between sections instead of `<hr>`. Pull quotes get an oversized italic Cormorant treatment with painted bracket lines.

### `/video`

Each video card is a square thumbnail with edge bleed. Video page: 16:9 player with painted frame border (4 painted strokes that draw in on mount).

### `/music`

Music player gets a custom skin:
- Track list in Plex Mono, current track in italic Cormorant
- Play/pause/skip controls drawn as ink-line SVG icons
- Progress bar: painted brushstroke that fills horizontally
- Album art for each track displayed with edge bleed
- Visualizer (subtle): single ringed orb that pulses with audio amplitude (web audio analyser node)

### `/shop` and `/shop/[slug]`

Product grid: amber-bordered cards on parchment surface so commerce stays readable. Product detail: large painting hero, Cormorant title, Plex Mono price, "ADD TO CART" button is a wide painted-stroke shape. Cart drawer slides in with painted left edge.

### `/about`

Atmospheric layer stays. Two-column: profile photo (with painted bleed border) on left, Cormorant body bio on right. Contact form (WhatsApp) has Plex Mono labels, Cormorant inputs, painted submit button. Social links as Plex Mono uppercase.

### `/admin/*` — painterly admin

Selected option B in brainstorming. Same atmospheric layer with reduced intensity:
- Sidebar: deep `night` background, italic Cormorant brand, Plex Mono nav, amber active state with brushstroke left-border
- Work area: parchment base + low-opacity painting ghost (single static painting, no Ken-Burns) + soft radial washes
- Tables: Plex Mono headers, Cormorant table cell text where artistic (titles), Plex Mono where structured (counts, dates, status pills)
- Forms: Plex Mono labels, Cormorant inputs (slightly larger than usual), amber painted submit buttons
- Login page (`/admin`): also gets the atmospheric layer (currently it shows AdminNav even when unauthenticated — fix in implementation)

### Page transitions

Replace the existing `PageTransition` component:
- Outgoing page fades while a painted brushstroke "wipes" left-to-right across the screen (SVG mask animation)
- Incoming page fades up underneath
- 600ms total
- Reduced motion: simple opacity crossfade, 200ms

### Custom cursor

Replace the existing `CustomCursor`:
- Small amber dot (10px) follows the cursor
- Trail: a faint amber painted line that fades over 800ms (canvas-based, capped at 30 segments)
- Hover state on links: dot grows to 24px and an amber ring fades in
- Touch devices: cursor disabled

### Loader

Replace existing `Loader`:
- Black night background
- Three orbs ease in one by one, painted underline draws beneath, then the whole loader fades out as the home painting fades in
- Total ~1.6s on first load only; instantly skipped on cache hits

---

## Components

```
components/
  atmosphere/
    AtmosphericLayer.tsx     # the shared bg layer (paintings, turbulence, brushstrokes, orbs, vignette)
    PaintedUnderline.tsx     # animated SVG underline
    PaintedDivider.tsx       # horizontal painted divider for sections / markdown
    RingedOrb.tsx            # composable orb with ring auras
    BrushButton.tsx          # painted-stroke shaped button (used for CTAs)
    BleedImage.tsx           # next/image with turbulence-bleed wrapper
    PaintedFrame.tsx         # 4-stroke rectangle frame, draws in on mount
  layout/
    PageTransition.tsx       # rewritten with brushstroke wipe
    Nav.tsx                  # Plex Mono uppercase nav, italic Cormorant brand
    Footer.tsx               # painted divider above, social icons as ink lines
  ui/
    CustomCursor.tsx         # rewritten amber painted cursor
    Loader.tsx               # rewritten orb loader
```

Existing components in `components/` are kept (no logic changes), only their styling/className is updated.

---

## Tailwind config changes

`tailwind.config.ts` — extend with brand palette and font families:

```ts
extend: {
  colors: {
    brand: {
      iris: '#6B5BA8', indigo: '#3B4FB0', lilac: '#9D7EC8',
      coral: '#E89B7C', amber: '#E8B86F', rose: '#D86E78',
      cream: '#FBE7D0', night: '#0E0A1C', parchment: '#FBF7EE',
    },
  },
  fontFamily: {
    serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
    mono:  ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
  },
}
```

Old `ocean` / `seafoam` / `charcoal` color tokens are removed. Every existing `bg-ocean`, `text-charcoal`, etc. is rewritten to brand tokens during implementation. Existing `font-sans` usages are migrated to `font-mono` (for UI/labels) or `font-serif` (for prose). Tailwind's default `font-sans` is left untouched as a system fallback only.

---

## next.config.ts

Add CloudFront image hostname so painting URLs resolve through `next/image`:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '*.vercel-storage.com' },
    { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    { protocol: 'https', hostname: 'd1l8km4g5s76x5.cloudfront.net' },
  ],
}
```

`picsum.photos` and `fastly.picsum.photos` are removed (no longer used after seeding real paintings).

---

## Gallery seeding

A new script `scripts/seed-paintings-wad.ts` pushes the 18 paintings from `scripts/artworks-wad2026.json` into Vercel Blob:

1. Fetch each `url` (CloudFront)
2. Upload to Blob at `gallery/<slug>.jpg`
3. Write `gallery.json` with `{ slug, title, year: 2024, blobUrl, tags }` array
4. Idempotent — check existing blob first, skip if present

Run once via `BLOB_READ_WRITE_TOKEN=… npx tsx scripts/seed-paintings-wad.ts`.

The existing demo seed (`scripts/seed-demo.ts`) is left intact for future resets but no longer the default.

---

## Performance and accessibility

- **Painting layer** uses `next/image` with `priority` for the first crossfade slot. Other slots loaded after first paint.
- **SVG turbulence filters** are GPU-accelerated; the displacement scale animation runs at 28s — cheap. Mobile: reduce scale from 14 to 8.
- **Mobile <768px**: `<AtmosphericLayer />` shows one static painting (no crossfade), 2 brushstrokes (not 5), no orbs in body sections.
- **Reduced motion** as described above.
- **Color contrast**: hero text on painting backgrounds is always cream over a vignette gradient that guarantees AA contrast. Body text on parchment is `night` (`#0E0A1C`) on `#FBF7EE` — passes AAA.
- **Fonts**: subset to Latin only via next/font; total font payload < 80kb.
- **No WebGL** — earlier WebGL impasto option was rejected. Pure SVG + CSS keeps the site lightweight and works everywhere.

---

## Implementation phases (high-level — full plan written next)

1. **Foundation** — Tailwind palette + fonts, next.config images, gitignore (`.superpowers/`)
2. **Atmosphere primitives** — `AtmosphericLayer`, `PaintedUnderline`, `PaintedDivider`, `RingedOrb`, `BleedImage`, `BrushButton`, `PaintedFrame`
3. **Layout shell** — Nav, Footer, PageTransition, CustomCursor, Loader, root layout integration
4. **Public pages** — Home, Gallery (index + detail), Photography, Writing, Video, Music, Shop, About
5. **Admin** — sidebar restyle, work-area painterly variant, all admin pages, login page fix (no AdminNav when unauthenticated)
6. **Seeding** — `scripts/seed-paintings-wad.ts`, run against production Blob
7. **QA** — desktop, mobile, reduced-motion, dark-room readability check

---

## Acceptance criteria

- Every public route uses `<AtmosphericLayer />` and reads as one cohesive painted world.
- Gallery is populated with all 18 World Art Dubai 2026 paintings.
- Cormorant Garamond italic + IBM Plex Mono are the only typefaces used.
- The current ocean/seafoam/charcoal palette is fully removed.
- Reduced motion users see a calm static version with no animation loops.
- Mobile renders smoothly (≥45fps on a mid-range phone) — verified by limiting layers as described.
- Admin remains usable: tables scan-able, forms readable, no atmosphere blocking content interaction.
- Build passes; no console errors; lighthouse Performance ≥ 80 on home.

---

## Out of scope

- Replacing NextAuth, Stripe, Resend, Blob, or any backend service.
- Reorganizing routes or admin permissions.
- Adding new pages or admin sections.
- Mobile app, native, or PWA work.
- Internationalization (existing site is English).
- WebGL/shader-based effects (rejected during brainstorming).
