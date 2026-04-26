# faavidel.art

Multidisciplinary creative portfolio and shop for the artist Faavidel — showcasing visual art, photography, writing, video, and music with an integrated e-commerce shop and a full custom admin CMS.

**Live:** [faavidel.art](https://faavidel.art)  
**Repo:** [github.com/Rezasz/faavidel.art](https://github.com/Rezasz/faavidel.art)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion + GSAP |
| Storage | Vercel Blob (JSON + media) |
| Auth | NextAuth.js v5 (credentials) |
| Payments | Stripe v22 |
| Email | Resend |
| Deployment | Vercel |

---

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # http://localhost:3000 (dev) / https://faavidel.art (prod)
ADMIN_USER=admin
ADMIN_PASS=               # your admin password
BLOB_READ_WRITE_TOKEN=    # from Vercel Blob storage dashboard
STRIPE_SECRET_KEY=        # sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=    # whsec_... from Stripe webhook endpoint
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_live_... or pk_test_...
RESEND_API_KEY=           # from resend.com
```

---

## Admin Panel

Access at `/admin` — username `admin`, password set via `ADMIN_PASS`.

Manages:
- **Gallery** — upload artwork images, titles, descriptions, tags
- **Photography** — series + individual photos with lightbox
- **Writing** — markdown editor with publish/draft toggle
- **Video** — YouTube/Vimeo links (auto-converted) or direct video upload
- **Music** — audio file upload or YouTube link; artwork per track
- **Shop** — products with images, price, stock, status
- **Orders** — view orders, mark as shipped
- **Homepage** — hero text, featured artworks, bio snippet
- **About** — bio, profile photo, Instagram, WhatsApp, Linktree, email
- **Settings** — site title, SEO meta, contact email

---

## Content Seeding

Initialize empty content structure (first deploy):
```bash
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed.ts
```

Load demo content with 12 artworks, 3 photo series, 4 essays, 5 shop products:
```bash
BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-demo.ts
```

---

## Deployment

1. Import repo in [vercel.com](https://vercel.com)
2. Add **Vercel Blob** storage (must be public access)
3. Set all environment variables in Vercel project settings
4. Deploy — then run the seed script once
5. Add Stripe webhook: `https://faavidel.art/api/webhooks/stripe` → event `checkout.session.completed`
6. Connect domain `faavidel.art`

---

## Project Structure

```
app/                     Next.js App Router pages + API routes
components/              Reusable UI, layout, and feature components
lib/                     Types, Blob helpers, auth, Stripe, Resend
context/                 Cart context (localStorage-backed)
scripts/                 seed.ts, seed-demo.ts
docs/superpowers/        Design spec + implementation plan
```

## Contact

- Instagram: [@faa.videl](https://www.instagram.com/faa.videl)
- WhatsApp: [+971 55 589 5441](https://wa.me/971555895441)
- Linktree: [linktr.ee/faavidel](https://linktr.ee/faavidel)
- Email: info@faavidel.art
