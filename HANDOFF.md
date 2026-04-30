# faavidel.art — Handoff Document

**Date:** 2026-05-01
**Status:** Live and stable. All commerce removed; site is portfolio-only. Gallery seeded with 62 paintings. Admin write/refresh path fixed end-to-end.

---

## What's live

A multidisciplinary portfolio with a painterly visual identity (Cormorant Garamond italic + IBM Plex Mono, painting-as-background atmosphere, ambient music) and a custom admin panel for the editable content. No on-site shop or cart — selling is done off-site via Web3 marketplaces.

### Public routes

| Route | Source of content |
|---|---|
| `/` | Hero rotates four artist-supplied prose poems; featured paintings + latest writing + bio teaser pulled from blob |
| `/gallery` | Blob: `content/gallery/index.json` (per-painting JSON at `content/gallery/<slug>.json`) — currently 62 entries (18 WAD 2026 + 44 from the All-in-one Faavi import) |
| `/gallery/[slug]` | Blob: `content/gallery/<slug>.json` — windowed image, prev/next, neutral black background |
| `/exhibitions` | Blob: `content/exhibitions/index.json` (managed via `/admin/exhibitions`); falls back to `scripts/exhibitions-data.json` (16 exhibitions across 2025 / 2024 / 2023, year-grouped) when blob is empty |
| `/writing`, `/writing/[slug]` | Blob: `content/writing/index.json` + per-post JSON |
| `/video` | Live: YouTube Atom feed for channel `UCTrofi53ugKi0u0FFhanACw` (`@Faavidel`) — refreshed daily |
| `/music` | Blob: `content/music/soundcloud.json` (just a URL); embeds SoundCloud iframe — refreshed daily |
| `/shop` | Blob: `content/shop/marketplaces.json` — 5 external marketplaces (Wallet Bubbles, hug.art, Drip.haus, Manifold, Objkt). Falls back to hard-coded defaults if blob is empty. |
| `/about` | Blob: `content/about.json` — bio, photo, Instagram, WhatsApp, Linktree, LinkedIn, Email. Falls back to `/about/portrait.jpg` if no photo set. |
| `/disclaimer`, `/cookies` | Static legal pages |

### Admin (`/admin`, login `admin` / `ADMIN_PASS`)

Dashboard · Gallery · Exhibitions · Writing · Music · Shop · Homepage · About · Settings.

Every admin page **refetches from the server after each save/delete**, so the admin list always shows what's actually persisted. The content API also calls `revalidatePath` on the affected public routes — so the live site reflects the change immediately, no 60s wait.

(Photography, Video, Orders, and Product CRUD have been removed. Music admin only stores a single SoundCloud URL; Shop admin manages the 5 marketplace cards.)

---

## Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Hosting + auto-deploy on push to `main` |
| Vercel Blob | All editable content (JSON) + media uploads |
| NextAuth v5 | Admin auth (credentials, JWT, 24h) |
| Resend | Transactional email |
| Google Analytics | G‑VZF34SJW3H — `next/script` afterInteractive in root layout |

No Stripe, no cart, no checkout API.

---

## Environment variables (set in Vercel project settings)

```
NEXTAUTH_SECRET       (required) openssl rand -base64 32
NEXTAUTH_URL          https://faavidel.art (prod) or http://localhost:3000 (dev)
ADMIN_USER            admin
ADMIN_PASS            (the admin password)
BLOB_READ_WRITE_TOKEN (current production token: vercel_blob_rw_mI7QUdQtqPZWQptO_dmwyuck2Y70WngPt4SR0Ixd7aEkmsP — rotate via Vercel Blob dashboard if exposed)
RESEND_API_KEY        (from resend.com — required only if transactional email is wired up)
```

**No Stripe variables required.**

---

## Visual system

- **Palette** (Tailwind `brand-*`): iris `#6B5BA8`, indigo `#3B4FB0`, lilac `#9D7EC8`, coral `#E89B7C`, amber `#E8B86F`, rose `#D86E78`, cream `#FBE7D0`, night `#0E0A1C`, parchment `#FBF7EE`.
- **Type**: Cormorant Garamond italic for display; IBM Plex Mono uppercase for labels/eyebrows. Both via `next/font`.
- **Atmosphere**: a single shared `<AtmosphericLayer />` (one static painting + vignette + grain — no animations, no SVG filters) sits behind every public route.
- **Reading panels**: text-heavy sections wrap in `.reading-panel` (60% night + backdrop blur) for legibility against the painting.
- **Cursor**: native browser cursor (the canvas-trail custom cursor was removed for performance).
- **Ambient music**: piano track at `public/audio/ambient.m4a`. Floating bottom-right toggle (defaults off, browser autoplay policy). Auto-paused on `/music`.
- **Favicon**: italic Cormorant "f" on night background (`app/icon.svg` + dynamic `app/apple-icon.tsx`).

---

## Operational notes

### Refresh cadence

- `/video` and `/music` use `revalidate = 86400` — refreshed once a day. Force a refresh by redeploying (`git commit --allow-empty -m "rebuild" && git push`) or hitting the route's revalidate endpoint.
- All admin-edited content (gallery, exhibitions, writing, about, homepage, settings, shop, music URL) uses `revalidate = 60` as a baseline, **but** the content API calls `revalidatePath` on save/delete so changes show up on the public site instantly. The 60s window only matters if blob is mutated outside the app (e.g. directly from the Vercel dashboard).
- Admin GETs return `Cache-Control: no-store` so the admin list is never stale.

### Adding paintings

Use `/admin/gallery`. Uploads go to Vercel Blob. The home page picks up new artworks automatically (sorted by `order`).

### Resetting / re-seeding the gallery

```bash
# 18 paintings from World Art Dubai 2026
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-paintings-wad.ts

# 44 paintings from a local directory of .jpg files (defaults to ~/Downloads/All in one Faavi)
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-paintings-allinone.ts [optional/source/dir]
```
Both are idempotent — already-uploaded images are skipped and the index is merged (not replaced). The All-in-one script uses each filename as the painting title and parses the trailing 4‑digit year.

### Updating exhibitions

Use `/admin/exhibitions` — full CRUD, image upload, drag-free reorder within a year. The page persists to `content/exhibitions/index.json` in blob. The legacy static JSON at `scripts/exhibitions-data.json` is kept as a fallback for first-load when blob is empty; images stored under `public/exhibitions/<filename>.jpg` still work alongside blob-uploaded ones.

### Updating the SoundCloud track

`/admin/music` → paste any SoundCloud URL (track, playlist, set, or profile) → Save. The public `/music` page picks it up on the next daily revalidate.

### Updating the YouTube channel

The video page is hard-wired to channel ID `UCTrofi53ugKi0u0FFhanACw` (`@Faavidel`). To change it, edit `CHANNEL_ID` in `app/video/page.tsx`.

### Updating the ambient track

Drop a new file at `public/audio/ambient.m4a` (or change the path in `context/MusicContext.tsx`). Loop + 800ms fade behavior is automatic.

---

## Reading the data layout

```
content/                                 (Vercel Blob keys; lib/blob.ts auto-prefixes "content/")
  about.json                             AboutContent
  homepage.json                          HomepageContent
  settings.json                          SiteSettings
  gallery/index.json                     GalleryIndex (summaries only)
  gallery/<slug>.json                    Artwork (full record)
  writing/index.json                     PostIndex
  writing/<slug>.json                    Post
  shop/marketplaces.json                 MarketplacesIndex (5 records)
  music/soundcloud.json                  MusicSettings ({ soundcloudUrl })
  exhibitions/index.json                 ExhibitionsIndex (managed via /admin/exhibitions)
```

The repo also ships static data:
- `scripts/exhibitions-data.json` — fallback for `/exhibitions` when the blob is empty
- `scripts/artworks-wad2026.json` — source list used by the WAD gallery seeder

---

## Contact info live on the site

- Instagram: https://www.instagram.com/faa.videl
- WhatsApp: +971 55 589 5441 (also powers the contact form on `/about`)
- Linktree: https://linktr.ee/faavidel
- LinkedIn: https://www.linkedin.com/in/faavidel-68843a144/
- Email: info@faavidel.art

---

## Repository

[github.com/Rezasz/faavidel.art](https://github.com/Rezasz/faavidel.art) · branch `main` · all commits pushed · build passing.
