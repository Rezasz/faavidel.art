# faavidel.art — Handoff Document

**Date:** 2026-04-27  
**Status:** Complete — deployed to Vercel, demo content seeded

---

## What Was Built

A full-stack creative portfolio and shop for the artist Faavidel. Everything runs on Vercel with no external database — content is stored as JSON in Vercel Blob, media (images, audio, video) as binary files.

### Public Pages

| Route | Description |
|---|---|
| `/` | Home — hero with GSAP ink-reveal animation, featured gallery, writing preview, bio CTA |
| `/gallery` | Visual art grid with tag filter |
| `/gallery/[slug]` | Single artwork detail |
| `/photography` | Photo series index |
| `/photography/[series]` | Series with full-screen lightbox |
| `/writing` | Blog/essay list |
| `/writing/[slug]` | Single post (rendered Markdown) |
| `/video` | Embedded video grid |
| `/music` | Audio player + track list (supports audio files and YouTube embeds) |
| `/shop` | Products grid with cart |
| `/shop/[slug]` | Product detail + add to cart |
| `/about` | Bio, profile photo, social links, WhatsApp contact form |

### Admin CMS (`/admin`)

All content is editable. Login: `admin` / `ADMIN_PASS` env var.

| Route | Manages |
|---|---|
| `/admin/dashboard` | Stats overview (artworks, posts, products, orders) |
| `/admin/gallery` | Upload artwork images, CRUD with tags and year |
| `/admin/photography` | Series + photos per series |
| `/admin/writing` | Markdown editor, publish/draft toggle |
| `/admin/video` | YouTube/Vimeo links (auto-converted) or video file upload |
| `/admin/music` | Audio file upload OR YouTube link; artwork per track |
| `/admin/shop` | Products — price, images, stock, status |
| `/admin/orders` | View orders, mark as shipped/delivered |
| `/admin/homepage` | Hero text, featured artwork slugs, bio snippet |
| `/admin/about` | Bio, profile photo, Instagram, WhatsApp, Linktree, email |
| `/admin/settings` | Site title, SEO description, contact email |

---

## Infrastructure

| Service | Purpose | Notes |
|---|---|---|
| Vercel | Hosting + deployment | Auto-deploys on push to `main` |
| Vercel Blob | All content + media storage | Must be **public** access mode |
| Stripe | Shop checkout + webhooks | Webhook endpoint: `/api/webhooks/stripe` |
| Resend | Order confirmation + contact emails | From address: `noreply@faavidel.art` (verify domain in Resend) |
| NextAuth v5 | Admin authentication | JWT session, 24hr expiry |

---

## Environment Variables

All set in Vercel project settings → Environment Variables:

```
NEXTAUTH_SECRET=9jS8nV0zqYJKH285pIhVopS87SExC5n8yMhnY2xu2IA=
NEXTAUTH_URL=https://faavidel.art
ADMIN_USER=admin
ADMIN_PASS=Faezeh@
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_mI7QUdQtqPZWQptO_cJJGTCuqNRFojHcdxIidAW6Xi4OH1X
STRIPE_SECRET_KEY=<add when ready>
STRIPE_WEBHOOK_SECRET=<add when ready>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<add when ready>
RESEND_API_KEY=<add when ready>
```

---

## Remaining Setup (Action Required)

### Stripe (when ready)
1. Get API keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel env vars
3. Create a webhook endpoint in Stripe → `https://faavidel.art/api/webhooks/stripe`
   - Event: `checkout.session.completed`
4. Copy the webhook signing secret → add as `STRIPE_WEBHOOK_SECRET`
5. Redeploy (or trigger redeploy from Vercel dashboard)

### Resend (for emails)
1. Get API key from [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to Vercel env vars
3. Verify the domain `faavidel.art` in Resend DNS settings so `noreply@faavidel.art` can send
4. Redeploy

### Domain
- Point `faavidel.art` DNS to Vercel (add domain in Vercel project → Domains)

---

## Content Management

### Adding real content
1. Go to `https://faavidel.art/admin`
2. Upload your artwork, photos, writing, videos, music, and shop products
3. All uploads go to Vercel Blob automatically

### Re-seeding demo content
If you need to reset to demo content:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_mI7QUdQtqPZWQptO_... npx tsx scripts/seed-demo.ts
```

---

## Contact Info (live in the site)

- **Instagram:** https://www.instagram.com/faa.videl
- **WhatsApp:** +971 55 589 5441
- **Linktree:** https://linktr.ee/faavidel
- **Email:** info@faavidel.art

Contact form on `/about` composes a WhatsApp message with the visitor's name, email, and message — no backend required.

---

## Key Technical Notes

- **No database** — all data is Vercel Blob JSON. Content API at `/api/content/[...path]` reads/writes blobs. Write/delete operations require admin session. Order blobs (`orders/*`) also require auth on read.
- **Stripe metadata limit** — cart items are serialized without `imageUrl` to stay under Stripe's 500-char metadata limit. `imageUrl` is stored as `''` in orders.
- **YouTube URLs** — the video and music admin pages accept regular YouTube watch URLs (`youtube.com/watch?v=...` or `youtu.be/...`) and auto-convert them to embed format.
- **NextAuth v5** — uses the `proxy.ts` file (not `middleware.ts`) per Next.js 16 conventions.
- **Tailwind v3** — the project uses Tailwind CSS v3 (not v4) for config compatibility.

---

## Repository

[github.com/Rezasz/faavidel.art](https://github.com/Rezasz/faavidel.art)  
Branch: `main` — all commits pushed, build passing.
