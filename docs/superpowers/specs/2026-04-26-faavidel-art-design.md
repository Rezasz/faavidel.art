# faavidel.art — Design Spec

**Date:** 2026-04-26  
**Status:** Approved

---

## Overview

A multidisciplinary creative portfolio and shop for the artist Faavidel. The site showcases visual art, photography, writing, video, and music — and sells prints/products via an integrated shop. All content is fully editable through a custom admin panel at `/admin`.

---

## Site Structure

```
/ (Home)              — Hero, featured work, bio snippet, latest posts
/gallery              — Visual art & illustrations (filterable grid)
/gallery/[slug]       — Single artwork detail page
/photography          — Photo series index
/photography/[series] — Photo series gallery
/writing              — Blog posts & essays list
/writing/[slug]       — Single post (rendered markdown)
/video                — Embedded video works grid
/music                — Audio player + track list
/shop                 — Prints & products grid + cart
/shop/[slug]          — Product detail + add to cart
/about                — Full bio, profile photo, contact form
/admin                — Admin login
/admin/dashboard      — Stats overview (views, orders, uploads)
/admin/gallery        — Upload/delete artwork, title, description, tags, order
/admin/photography    — Manage photo series and photos per series
/admin/writing        — Rich text (markdown) editor, publish/draft toggle
/admin/video          — Add/edit video embeds or uploads
/admin/music          — Upload audio files, set title, artwork, order
/admin/shop           — Add/edit/delete products, price, images, stock
/admin/orders         — View orders, mark as shipped
/admin/homepage       — Edit hero text, featured selections, bio snippet
/admin/about          — Edit full bio, profile photo, social links
/admin/settings       — Site title, SEO meta, contact email
```

---

## Visual Design

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Primary | Ocean Blue | `#0B3C5D` |
| CTA / Accent | Burnt Red | `#A63D40` |
| Base | White | `#FFFFFF` |
| Off-white (sections) | Warm Off-white | `#F8F7F5` / `#F2F1EF` |
| Text / Structure | Charcoal Blue | `#1F2A36` |
| UI Dividers | Soft Gray | `#E5E7EB` |
| Cool Accent | Seafoam | `#5FA8A9` |

Sand beige (`#D9C5A0`) is used only as a **text/detail accent**, never as a background color.

### Typography
- **Headings:** Georgia (serif) — elegant, editorial
- **Body / UI:** System sans-serif stack (Inter or system-ui)
- **Letter-spacing:** generous on headings (0.08–0.18em), tight on body

### Layout Principles
- Sections alternate between white (`#FFFFFF`) and warm off-white (`#F8F7F5`)
- Ocean Blue used for hero, about section, and nav
- Charcoal for footer
- Burnt Red exclusively for CTAs, rules/dividers, and price labels
- Seafoam for labels, tags, secondary accents

---

## Animations

| Element | Animation |
|---|---|
| Hero title | Ink-reveal on load (clip-path wipe, GSAP) |
| Nav links | Staggered fade + slide down on load (Framer Motion) |
| Page transitions | Slide + fade via Framer Motion `AnimatePresence` |
| Gallery images | Scale 0.95→1 + fade on scroll-into-view |
| Custom cursor | Circle cursor that morphs on image hover |
| Hero background | Subtle parallax scroll effect |
| Shop cards | Hover: image zoom + price reveal from bottom |
| Writing list | Posts slide in from left on scroll |
| Hero canvas | Floating particles/orbs (canvas, vanilla JS) |
| Page loader | Full-screen animated logo loader on first visit |

**Libraries:** Framer Motion (page transitions, scroll animations), GSAP (hero reveal, complex sequences)

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Modern, Vercel-native, full-stack |
| Styling | Tailwind CSS | Fast, consistent utility-first styling |
| Animations | Framer Motion + GSAP | Best-in-class for React + complex sequences |
| Storage | Vercel Blob | File-based, Vercel-native, no external DB |
| Auth | NextAuth.js (credentials) | Simple, hardcoded admin credentials |
| Payments | Stripe | Checkout + webhooks for order processing |
| Email | Resend | Order confirmations, contact form |
| Deployment | Vercel | Single-platform hosting |

---

## Data Storage (Vercel Blob)

All persistent data stored as JSON files in Vercel Blob. No external database.

### Content structure

```
/content/
  site.json              — Global settings (title, SEO, contact email)
  homepage.json          — Hero text, featured work IDs, bio snippet
  about.json             — Full bio, social links, profile photo URL
  gallery/
    index.json           — Ordered list of artwork metadata
    [slug].json          — Single artwork: title, description, tags, image URL
  photography/
    index.json           — List of series
    [series]/
      index.json         — Series metadata + ordered photo list
      [photo].json       — Photo metadata + image URL
  writing/
    index.json           — List of posts (title, slug, date, status)
    [slug].json          — Post content (markdown), metadata
  video/
    index.json           — List of videos (title, embed URL or file URL, description)
  music/
    index.json           — Ordered track list (title, file URL, artwork URL, duration)
  shop/
    index.json           — Product list
    [slug].json          — Product: title, description, price, images, stock
  orders/
    index.json           — Order index (IDs, dates, status)
    [orderId].json       — Full order details (items, customer, shipping, payment)
```

### Media files
All images, audio, and video files uploaded directly to Vercel Blob and referenced by URL in JSON files.

---

## Admin Authentication

- Route: `/admin`
- Provider: NextAuth.js Credentials
- Credentials: hardcoded in environment variables
  - `ADMIN_USER=admin`
  - `ADMIN_PASS=Faezeh@`
- Session: JWT cookie, 24-hour expiry
- All `/admin/*` routes protected by middleware — redirect to `/admin` if not authenticated

---

## E-commerce Flow

1. Customer browses `/shop`, adds items to cart (cart state in `localStorage`)
2. Proceeds to checkout → Stripe Checkout session created via API route
3. Stripe handles payment, redirects back on success
4. Stripe webhook (`/api/webhooks/stripe`) creates order JSON in Vercel Blob
5. Resend sends confirmation email to customer
6. Admin views and manages orders at `/admin/orders`

---

## Key API Routes

```
POST /api/auth/[...nextauth]   — NextAuth auth handler
GET  /api/content/[...path]    — Read content JSON from Blob
POST /api/content/[...path]    — Write content JSON to Blob (admin only)
POST /api/upload               — Upload media file to Blob (admin only)
POST /api/checkout             — Create Stripe checkout session
POST /api/webhooks/stripe      — Handle Stripe payment events
POST /api/contact              — Send contact form email via Resend
```

---

## Hosting & Environment Variables

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://faavidel.art
ADMIN_USER=admin
ADMIN_PASS=Faezeh@
BLOB_READ_WRITE_TOKEN=        — Vercel Blob
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
```

All hosted on Vercel. Single deployment, zero external infrastructure.
