# faavidel.art

Multidisciplinary creative portfolio — art, photography, music, writing & shop.

Built with Next.js 16, Tailwind CSS, Framer Motion, GSAP, Vercel Blob, NextAuth.js, and Stripe.

## Local Development

```bash
npm install
npm run dev
```

## Admin

Access the admin panel at `/admin`
- Username: `admin`
- Password: set via `ADMIN_PASS` env var

## Environment Variables

See `.env.local.example` for required variables.

## Deployment

Deploy to Vercel. Add Vercel Blob storage from the Storage tab.
Run `npx tsx scripts/seed.ts` after first deployment to initialize content.
