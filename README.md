# faavidel.art

Multidisciplinary creative portfolio for the artist Faavidel (Faezeh Ghavidel) — paintings, exhibitions, writing, video, music, and curated marketplace links — with a custom admin panel.

**Live:** [faavidel.art](https://faavidel.art)
**Repo:** [github.com/Rezasz/faavidel.art](https://github.com/Rezasz/faavidel.art)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) |
| Styling | Tailwind CSS v3 with brand tokens |
| Type | Cormorant Garamond + IBM Plex Mono (`next/font`) |
| Animation | Framer Motion (page transitions + hover) |
| Storage | Vercel Blob (JSON content + uploaded media) |
| Auth | NextAuth.js v5 (credentials, JWT 24h) |
| Email | Resend |
| Analytics | Google Analytics G‑VZF34SJW3H (`next/script`) |
| Deployment | Vercel (auto on push to `main`) |

---

## Local development

```bash
npm install
cp .env.local.example .env.local      # fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

```env
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # http://localhost:3000 (dev) / https://faavidel.art (prod)
ADMIN_USER=admin
ADMIN_PASS=               # admin password
BLOB_READ_WRITE_TOKEN=    # from Vercel Blob storage dashboard
RESEND_API_KEY=           # from resend.com (used for transactional email)
```

No Stripe / cart variables — on-site commerce was removed; the shop links to external Web3 marketplaces.

---

## Public pages

| Route | Description |
|---|---|
| `/` | Home — wordmark, rotating prose hero, featured paintings, latest writing, about teaser |
| `/gallery` | Painting grid (62 works seeded — 18 from World Art Dubai 2026 + 44 from the All-in-one Faavi import), tag filter, gentle amber light sweep |
| `/gallery/[slug]` | Single painting — windowed view on neutral black background, prev/next navigation |
| `/exhibitions` | Year-grouped list (2025 / 2024 / 2023) — reads from blob (`content/exhibitions/index.json`), falls back to `scripts/exhibitions-data.json` (16 exhibitions) when blob is empty |
| `/writing` | Essays — Cormorant title list with painted dividers |
| `/writing/[slug]` | Single post on a parchment reading surface |
| `/video` | Latest videos from `youtube.com/@Faavidel`, fetched server-side from the channel's Atom feed (refreshed daily) |
| `/music` | Single SoundCloud iframe driven by a URL stored in blob (refreshed daily) |
| `/shop` | Five external marketplaces (Wallet Bubbles, hug.art, Drip.haus, Manifold, Objkt) — content editable via admin |
| `/about` | Self‑portrait + bio + social links (Instagram, WhatsApp, Linktree, LinkedIn, Email) + WhatsApp contact form |
| `/disclaimer` | Site disclaimer |
| `/cookies` | Cookie policy |

---

## Painterly atmosphere

Every public page sits over a shared `<AtmosphericLayer />` that renders a single static painting + vignette + film grain (no animations, no SVG filters — keeps the GPU cost near zero). A bottom‑right floating button toggles ambient music (the artist's own track at `public/audio/ambient.m4a`); preference is stored in `localStorage`.

Reading panels (60% night + backdrop blur) sit behind text content for legibility. The custom cursor was removed in favor of the native cursor for performance.

---

## Admin panel

Access at `/admin` (username `admin`, password from `ADMIN_PASS`). The admin shell stays on a parchment work surface with subtle painting ghost.

| Route | Manages |
|---|---|
| `/admin/dashboard` | Counts of artworks + exhibitions + posts |
| `/admin/gallery` | Paintings — upload, title, description, tags, year |
| `/admin/exhibitions` | Year-grouped exhibitions — title, dates, venue, location, format, curator, link, image (upload or filename), reorder, delete, add |
| `/admin/writing` | Markdown posts with publish/draft toggle |
| `/admin/music` | The single SoundCloud URL |
| `/admin/shop` | The five marketplace cards (title, URL, domain, description, reorder, delete, add) |
| `/admin/homepage` | Hero text + featured artwork slugs + bio snippet |
| `/admin/about` | Bio, profile photo, Instagram, WhatsApp, Linktree, LinkedIn, email |
| `/admin/settings` | Site title, SEO description, contact email |

Every admin page refetches from the server after each save/delete and the content API calls `revalidatePath` on the affected public routes — so changes show up in the admin list **and** on the live site immediately, without a manual refresh.

Photography, Video, and Shop product CRUD were removed. The shop now links to external Web3 marketplaces; videos pull from YouTube; music embeds SoundCloud.

---

## Content seeding

Two seed scripts (both idempotent — re‑running skips already‑uploaded images and merges with the existing index):

```bash
# 18 paintings from World Art Dubai 2026 (fetched from URLs in scripts/artworks-wad2026.json)
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-paintings-wad.ts

# 44 paintings from a local directory of .jpg files (defaults to ~/Downloads/All in one Faavi)
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-paintings-allinone.ts [optional/source/dir]
```

The All‑in‑one Faavi script uses each filename as the painting title and parses the trailing 4‑digit year (e.g. `441 years later 2024.jpg` → title `441 years later 2024`, year `2024`).

Exhibition data lives in `scripts/exhibitions-data.json` and ships with the repo. Exhibitions saved through `/admin/exhibitions` go to `content/exhibitions/index.json` in blob and override the seed.

---

## Deployment

1. Import the repo at [vercel.com](https://vercel.com).
2. Provision a **Vercel Blob** store (public access).
3. Set the env vars above in Vercel project settings.
4. Push to `main` — Vercel auto‑deploys.
5. Run the gallery seed once (above) if the gallery is empty.
6. Connect the `faavidel.art` domain in Vercel.

---

## Project structure

```
app/                      # Next.js App Router pages + API routes
  admin/                  # Authenticated admin
  api/content/[...]       # Generic blob read/write API (auth-gated on writes)
components/
  atmosphere/             # AtmosphericLayer, BleedImage, RingedOrb, PaintedDivider, BrushButton, etc.
  layout/                 # Nav, Footer, PageTransition
  home/                   # HeroQuoteRotator
  ui/                     # BackgroundMusic, Loader, CustomCursor (no-op)
context/                  # MusicContext (ambient audio state)
lib/                      # blob.ts, types.ts, auth.ts, slug.ts, resend.ts
public/                   # audio/ambient.m4a, about/portrait.jpg, exhibitions/*.jpg
scripts/                  # seed-paintings-wad.ts, seed-paintings-allinone.ts, exhibitions-data.json, patch-about-linkedin.ts, copy-exhibition-images.mjs, test-music-context.ts
docs/superpowers/         # design specs + implementation plans
```

---

## Contact

- Instagram: [@faa.videl](https://www.instagram.com/faa.videl)
- WhatsApp: [+971 55 589 5441](https://wa.me/971555895441)
- Linktree: [linktr.ee/faavidel](https://linktr.ee/faavidel)
- LinkedIn: [linkedin.com/in/faavidel-68843a144](https://www.linkedin.com/in/faavidel-68843a144/)
- Email: info@faavidel.art
