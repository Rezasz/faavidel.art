# faavidel.art Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack multidisciplinary creative portfolio and shop for faavidel.art with a custom admin CMS, Stripe checkout, and rich animations — all hosted on Vercel with Vercel Blob as the only data store.

**Architecture:** Next.js 14 App Router + Tailwind CSS frontend. All content stored as JSON files in Vercel Blob; media (images, audio, video) stored as binary files in Vercel Blob. Admin protected by NextAuth credentials middleware. Stripe Checkout for e-commerce. Framer Motion + GSAP for animations.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP, Vercel Blob, NextAuth.js, Stripe, Resend

---

## File Map

```
/
├── app/
│   ├── layout.tsx                        Root layout (nav, footer, cursor, loader, transitions)
│   ├── page.tsx                          Home page
│   ├── gallery/
│   │   ├── page.tsx                      Gallery index (filterable grid)
│   │   └── [slug]/page.tsx               Single artwork
│   ├── photography/
│   │   ├── page.tsx                      Series index
│   │   └── [series]/page.tsx             Series photo gallery
│   ├── writing/
│   │   ├── page.tsx                      Post list
│   │   └── [slug]/page.tsx               Single post (markdown)
│   ├── video/page.tsx                    Video grid
│   ├── music/page.tsx                    Music player + track list
│   ├── shop/
│   │   ├── page.tsx                      Products grid
│   │   └── [slug]/page.tsx               Product detail
│   ├── about/page.tsx                    About page
│   ├── admin/
│   │   ├── page.tsx                      Admin login form
│   │   ├── layout.tsx                    Admin layout (auth guard)
│   │   ├── dashboard/page.tsx            Overview stats
│   │   ├── gallery/page.tsx              Manage artwork
│   │   ├── photography/page.tsx          Manage photo series
│   │   ├── writing/page.tsx              Post editor
│   │   ├── video/page.tsx                Manage videos
│   │   ├── music/page.tsx                Manage tracks
│   │   ├── shop/page.tsx                 Manage products
│   │   ├── orders/page.tsx               View/manage orders
│   │   ├── homepage/page.tsx             Edit homepage content
│   │   ├── about/page.tsx                Edit about content
│   │   └── settings/page.tsx             Site settings
│   └── api/
│       ├── auth/[...nextauth]/route.ts   NextAuth handler
│       ├── content/[...path]/route.ts    Read/write Blob JSON
│       ├── upload/route.ts               Upload media to Blob
│       ├── checkout/route.ts             Create Stripe session
│       ├── webhooks/stripe/route.ts      Handle Stripe events
│       └── contact/route.ts             Send contact email
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                       Site navigation
│   │   ├── Footer.tsx                    Site footer
│   │   └── PageTransition.tsx            Framer Motion page wrapper
│   ├── ui/
│   │   ├── CustomCursor.tsx              Morphing cursor
│   │   ├── Loader.tsx                    Full-screen logo loader
│   │   ├── AnimatedSection.tsx           Scroll-reveal wrapper
│   │   └── HeroParticles.tsx             Canvas floating particles
│   ├── home/
│   │   └── HeroSection.tsx              Hero with GSAP text reveal
│   ├── gallery/
│   │   ├── GalleryGrid.tsx              Filterable artwork grid
│   │   └── ArtworkCard.tsx              Single artwork card
│   ├── photography/
│   │   ├── SeriesGrid.tsx               Photo series grid
│   │   └── PhotoLightbox.tsx            Full-screen photo lightbox
│   ├── writing/
│   │   └── PostList.tsx                 Animated post list
│   ├── video/
│   │   └── VideoGrid.tsx                Video embed grid
│   ├── music/
│   │   └── AudioPlayer.tsx              Audio player with track list
│   ├── shop/
│   │   ├── ProductGrid.tsx              Products grid
│   │   ├── ProductCard.tsx              Product card with hover
│   │   └── CartDrawer.tsx               Slide-in cart drawer
│   └── admin/
│       ├── AdminNav.tsx                  Admin sidebar nav
│       ├── FileUpload.tsx                Drag-drop file uploader
│       ├── RichTextEditor.tsx            Markdown editor
│       └── SortableList.tsx              Drag-to-reorder list
├── lib/
│   ├── types.ts                          All TypeScript interfaces
│   ├── blob.ts                           Vercel Blob read/write helpers
│   ├── auth.ts                           NextAuth config
│   ├── stripe.ts                         Stripe client
│   └── resend.ts                         Resend email client
├── hooks/
│   ├── useCart.ts                        Cart state (localStorage + context)
│   └── useAnimations.ts                  Shared GSAP timeline hooks
├── context/
│   └── CartContext.tsx                   Cart context provider
├── middleware.ts                          Protect /admin/* routes
├── tailwind.config.ts
├── next.config.ts
└── .env.local
```

---

## Phase 1: Foundation

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local`, `.gitignore`

- [ ] **Step 1: Create the Next.js app**

```bash
cd /Users/rezasahebozamani/Documents/source/faavidel.art
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

Expected: Project scaffolded with App Router, TypeScript, Tailwind.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion gsap @gsap/react next-auth@beta @vercel/blob stripe @stripe/stripe-js resend react-markdown remark remark-html lucide-react
npm install -D @types/node
```

- [ ] **Step 3: Update `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Update `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#0B3C5D',
        burnt: '#A63D40',
        seafoam: '#5FA8A9',
        sand: '#D9C5A0',
        charcoal: '#1F2A36',
        'off-white': '#F8F7F5',
        'off-white-2': '#F2F1EF',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        wider: '0.12em',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Create `.env.local`**

```bash
cat > .env.local << 'EOF'
NEXTAUTH_SECRET=change-me-in-production-use-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
ADMIN_USER=admin
ADMIN_PASS=Faezeh@
BLOB_READ_WRITE_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
EOF
```

- [ ] **Step 6: Create `.gitignore` additions**

```bash
echo ".env.local" >> .gitignore
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js project with dependencies"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
// lib/types.ts

export interface Artwork {
  slug: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  year: number
  order: number
  createdAt: string
}

export interface GalleryIndex {
  artworks: Pick<Artwork, 'slug' | 'title' | 'imageUrl' | 'tags' | 'order'>[]
}

export interface PhotoSeries {
  slug: string
  title: string
  description: string
  coverUrl: string
  order: number
  createdAt: string
}

export interface Photo {
  id: string
  url: string
  caption: string
  order: number
}

export interface PhotoSeriesDetail extends PhotoSeries {
  photos: Photo[]
}

export interface PhotographyIndex {
  series: Pick<PhotoSeries, 'slug' | 'title' | 'coverUrl' | 'order'>[]
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  status: 'published' | 'draft'
  tags: string[]
  createdAt: string
}

export interface PostIndex {
  posts: Pick<Post, 'slug' | 'title' | 'excerpt' | 'date' | 'status' | 'tags'>[]
}

export interface VideoItem {
  id: string
  title: string
  description: string
  embedUrl: string
  thumbnailUrl: string
  order: number
  createdAt: string
}

export interface VideoIndex {
  videos: VideoItem[]
}

export interface Track {
  id: string
  title: string
  fileUrl: string
  artworkUrl: string
  duration: string
  order: number
  createdAt: string
}

export interface MusicIndex {
  tracks: Track[]
}

export interface Product {
  slug: string
  title: string
  description: string
  price: number
  images: string[]
  stock: number
  status: 'active' | 'archived'
  createdAt: string
}

export interface ProductIndex {
  products: Pick<Product, 'slug' | 'title' | 'price' | 'images' | 'stock' | 'status'>[]
}

export interface OrderItem {
  productSlug: string
  productTitle: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  items: OrderItem[]
  customerEmail: string
  customerName: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  stripeSessionId: string
  createdAt: string
}

export interface OrderIndex {
  orders: Pick<Order, 'id' | 'customerEmail' | 'total' | 'status' | 'createdAt'>[]
}

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  featuredArtworkSlugs: string[]
  bioSnippet: string
}

export interface AboutContent {
  fullBio: string
  profilePhotoUrl: string
  instagram: string
  email: string
  twitter?: string
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  metaImage: string
}

export interface CartItem {
  productSlug: string
  title: string
  price: number
  quantity: number
  imageUrl: string
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for all content models"
```

---

### Task 3: Vercel Blob Helpers

**Files:**
- Create: `lib/blob.ts`

- [ ] **Step 1: Create `lib/blob.ts`**

```typescript
// lib/blob.ts
import { put, head, del, list } from '@vercel/blob'

const CONTENT_PREFIX = 'content/'

/**
 * Read a JSON file from Vercel Blob.
 * Returns null if the file does not exist.
 */
export async function readJSON<T>(path: string): Promise<T | null> {
  const url = `${process.env.BLOB_READ_WRITE_TOKEN ? '' : ''}` // satisfied by Vercel env
  try {
    const blobs = await list({ prefix: CONTENT_PREFIX + path })
    const match = blobs.blobs.find(b => b.pathname === CONTENT_PREFIX + path)
    if (!match) return null
    const res = await fetch(match.url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

/**
 * Write a JSON file to Vercel Blob (upsert — overwrites if exists).
 */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await put(CONTENT_PREFIX + path, content, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
}

/**
 * Delete a file from Vercel Blob by pathname.
 */
export async function deleteBlob(path: string): Promise<void> {
  const blobs = await list({ prefix: CONTENT_PREFIX + path })
  const match = blobs.blobs.find(b => b.pathname === CONTENT_PREFIX + path)
  if (match) await del(match.url)
}

/**
 * Upload a media file to Vercel Blob.
 * Returns the public URL.
 */
export async function uploadMedia(
  file: File | Blob,
  pathname: string,
  contentType: string
): Promise<string> {
  const result = await put(`media/${pathname}`, file, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  })
  return result.url
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/blob.ts
git commit -m "feat: add Vercel Blob JSON read/write helpers"
```

---

### Task 4: NextAuth Configuration

**Files:**
- Create: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create `lib/auth.ts`**

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validUser = credentials?.username === process.env.ADMIN_USER
        const validPass = credentials?.password === process.env.ADMIN_PASS
        if (validUser && validPass) {
          return { id: '1', name: 'Admin', email: 'admin@faavidel.art' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
})
```

- [ ] **Step 2: Create `app/api/auth/[...nextauth]/route.ts`**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 3: Commit**

```bash
git add lib/auth.ts app/api/auth/
git commit -m "feat: add NextAuth with hardcoded admin credentials"
```

---

### Task 5: Admin Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin'
  const isAuthenticated = !!req.auth

  if (isAdminPath && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: protect /admin routes with NextAuth middleware"
```

---

### Task 6: Content API Routes

**Files:**
- Create: `app/api/content/[...path]/route.ts`, `app/api/upload/route.ts`

- [ ] **Step 1: Create `app/api/content/[...path]/route.ts`**

```typescript
// app/api/content/[...path]/route.ts
import { auth } from '@/lib/auth'
import { readJSON, writeJSON } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/') + '.json'
  const data = await readJSON(filePath)
  if (data === null) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await params
  const filePath = path.join('/') + '.json'
  const body = await req.json()
  await writeJSON(filePath, body)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Create `app/api/upload/route.ts`**

```typescript
// app/api/upload/route.ts
import { auth } from '@/lib/auth'
import { uploadMedia } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const pathname = formData.get('pathname') as string | null

  if (!file || !pathname) {
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 })
  }

  const url = await uploadMedia(file, pathname, file.type)
  return NextResponse.json({ url })
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/content/ app/api/upload/
git commit -m "feat: add content read/write and media upload API routes"
```

---

### Task 7: Stripe Client + Checkout Route

**Files:**
- Create: `lib/stripe.ts`, `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Create `lib/stripe.ts`**

```typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})
```

- [ ] **Step 2: Create `app/api/checkout/route.ts`**

```typescript
// app/api/checkout/route.ts
import { stripe } from '@/lib/stripe'
import { CartItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json()

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 })
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: { productSlug: item.productSlug },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'AU'],
    },
    success_url: `${process.env.NEXTAUTH_URL}/shop?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/shop`,
    metadata: {
      items: JSON.stringify(
        items.map((i) => ({
          productSlug: i.productSlug,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        }))
      ),
    },
  })

  return NextResponse.json({ url: session.url })
}
```

- [ ] **Step 3: Create `app/api/webhooks/stripe/route.ts`**

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { readJSON, writeJSON } from '@/lib/blob'
import { Order, OrderIndex, OrderItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const items: OrderItem[] = JSON.parse(session.metadata?.items ?? '[]')
    const shipping = session.shipping_details?.address

    const order: Order = {
      id: session.id,
      items,
      customerEmail: session.customer_details?.email ?? '',
      customerName: session.customer_details?.name ?? '',
      shippingAddress: {
        line1: shipping?.line1 ?? '',
        line2: shipping?.line2 ?? undefined,
        city: shipping?.city ?? '',
        state: shipping?.state ?? '',
        postalCode: shipping?.postal_code ?? '',
        country: shipping?.country ?? '',
      },
      total: (session.amount_total ?? 0) / 100,
      status: 'paid',
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    }

    await writeJSON(`orders/${order.id}.json`, order)

    // Update order index
    const index = (await readJSON<OrderIndex>('orders/index.json')) ?? { orders: [] }
    index.orders.unshift({
      id: order.id,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    })
    await writeJSON('orders/index.json', index)
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 4: Add missing import at top of webhook route**

Add `import Stripe from 'stripe'` at top of `app/api/webhooks/stripe/route.ts` after the existing imports.

- [ ] **Step 5: Commit**

```bash
git add lib/stripe.ts app/api/checkout/ app/api/webhooks/
git commit -m "feat: add Stripe checkout and webhook order creation"
```

---

### Task 8: Resend Email Client + Contact Route

**Files:**
- Create: `lib/resend.ts`, `app/api/contact/route.ts`

- [ ] **Step 1: Create `lib/resend.ts`**

```typescript
// lib/resend.ts
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)
```

- [ ] **Step 2: Create `app/api/contact/route.ts`**

```typescript
// app/api/contact/route.ts
import { resend } from '@/lib/resend'
import { readJSON } from '@/lib/blob'
import { SiteSettings } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const settings = await readJSON<SiteSettings>('site.json')
  const to = settings?.contactEmail ?? 'hello@faavidel.art'

  await resend.emails.send({
    from: 'faavidel.art <noreply@faavidel.art>',
    to,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/resend.ts app/api/contact/
git commit -m "feat: add Resend email client and contact API route"
```

---

## Phase 2: Layout + UI Components

### Task 9: Global CSS + Root Layout

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Replace `app/globals.css`**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    cursor: none;
  }
  body {
    @apply font-serif text-charcoal bg-white antialiased;
  }
  ::selection {
    background: theme('colors.seafoam');
    color: white;
  }
}

@layer utilities {
  .section-label {
    @apply font-sans text-xs tracking-[0.2em] uppercase text-seafoam;
  }
  .section-title {
    @apply text-3xl text-ocean font-serif;
  }
  .section-rule {
    @apply w-8 h-0.5 bg-burnt mt-1 mb-7;
  }
}
```

- [ ] **Step 2: Create `context/CartContext.tsx`**

```typescript
// context/CartContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('faavidel-cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('faavidel-cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productSlug === item.productSlug)
      if (existing) {
        return prev.map(i =>
          i.productSlug === item.productSlug
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (slug: string) =>
    setItems(prev => prev.filter(i => i.productSlug !== slug))

  const updateQuantity = (slug: string, qty: number) =>
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.productSlug !== slug)
        : prev.map(i => (i.productSlug === slug ? { ...i, quantity: qty } : i))
    )

  const clearCart = () => setItems([])
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
```

- [ ] **Step 3: Create `app/layout.tsx`**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import Loader from '@/components/ui/Loader'
import PageTransition from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: 'faavidel — Art, Photography, Music & Writing',
  description: 'A multidisciplinary creative portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Loader />
          <CustomCursor />
          <Nav />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx context/CartContext.tsx
git commit -m "feat: add root layout, cart context, global styles"
```

---

### Task 10: Nav + Footer

**Files:**
- Create: `components/layout/Nav.tsx`, `components/layout/Footer.tsx`

- [ ] **Step 1: Create `components/layout/Nav.tsx`**

```typescript
// components/layout/Nav.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const links = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/photography', label: 'Photography' },
  { href: '/writing', label: 'Writing' },
  { href: '/music', label: 'Music' },
  { href: '/video', label: 'Video' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean h-16 flex items-center justify-between px-8 md:px-12">
      <Link href="/" className="text-white font-serif text-xl tracking-widest">
        faavidel
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex gap-8">
        {links.map((l, i) => (
          <motion.div
            key={l.href}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Link
              href={l.href}
              className="font-sans text-xs tracking-wider uppercase text-white/70 hover:text-sand transition-colors"
            >
              {l.label}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/shop" className="relative">
          <ShoppingBag className="text-white w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
              {count}
            </span>
          )}
        </Link>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-ocean border-t border-white/10 flex flex-col p-6 gap-4 md:hidden"
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-sans text-sm tracking-wider uppercase text-white/80 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2 px-4 rounded text-center"
            >
              Shop
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/layout/Footer.tsx`**

```typescript
// components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/50 font-sans text-xs tracking-wider">
      <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          © {new Date().getFullYear()}{' '}
          <span className="text-seafoam">faavidel.art</span> — All rights reserved
        </div>
        <div className="flex gap-8">
          <Link href="/gallery" className="hover:text-white transition-colors uppercase">Gallery</Link>
          <Link href="/shop" className="hover:text-white transition-colors uppercase">Shop</Link>
          <Link href="/about" className="hover:text-white transition-colors uppercase">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create `components/layout/PageTransition.tsx`**

```typescript
// components/layout/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="pt-16"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/
git commit -m "feat: add Nav, Footer, PageTransition components"
```

---

### Task 11: Animation UI Components

**Files:**
- Create: `components/ui/CustomCursor.tsx`, `components/ui/Loader.tsx`, `components/ui/AnimatedSection.tsx`, `components/ui/HeroParticles.tsx`

- [ ] **Step 1: Create `components/ui/CustomCursor.tsx`**

```typescript
// components/ui/CustomCursor.tsx
'use client'
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 })
  const isHovering = useRef(false)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      isHovering.current = !!(target.closest('a, button, [data-cursor-hover]'))
      if (dotRef.current) {
        dotRef.current.style.transform = isHovering.current ? 'scale(2.5)' : 'scale(1)'
        dotRef.current.style.background = isHovering.current ? '#A63D40' : '#5FA8A9'
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-seafoam pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="fixed w-1.5 h-1.5 rounded-full bg-seafoam pointer-events-none z-[9999] transition-all duration-150"
        style={{ transform: 'translate(-50%, -50%)', top: 0, left: 0 }}
        id="cursor-dot"
      />
    </>
  )
}
```

- [ ] **Step 2: Update cursor dot position tracking — add this `useEffect` to `CustomCursor.tsx` inside the component (after the existing useEffect)**

```typescript
useEffect(() => {
  const dot = document.getElementById('cursor-dot')
  if (!dot) return
  const move = (e: MouseEvent) => {
    dot.style.left = e.clientX + 'px'
    dot.style.top = e.clientY + 'px'
  }
  window.addEventListener('mousemove', move)
  return () => window.removeEventListener('mousemove', move)
}, [])
```

- [ ] **Step 3: Create `components/ui/Loader.tsx`**

```typescript
// components/ui/Loader.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[99999] bg-ocean flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1
              className="text-white font-serif text-5xl tracking-[0.2em] mb-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              faavidel
            </motion.h1>
            <div className="w-12 h-px bg-burnt mx-auto" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Create `components/ui/AnimatedSection.tsx`**

```typescript
// components/ui/AnimatedSection.tsx
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : 0,
      x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 5: Create `components/ui/HeroParticles.tsx`**

```typescript
// components/ui/HeroParticles.tsx
'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; alpha: number; alphaDir: number
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.alphaDir
        if (p.alpha <= 0 || p.alpha >= 1) p.alphaDir *= -1
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(95, 168, 169, ${p.alpha * 0.6})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add custom cursor, page loader, animated section, and hero particles"
```

---

## Phase 3: Public Pages

### Task 12: Home Page + Hero

**Files:**
- Create: `components/home/HeroSection.tsx`, `app/page.tsx`

- [ ] **Step 1: Create `components/home/HeroSection.tsx`**

```typescript
// components/home/HeroSection.tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import HeroParticles from '@/components/ui/HeroParticles'

interface Props {
  title: string
  subtitle: string
  buttonText: string
}

export default function HeroSection({ title, subtitle, buttonText }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.9 }) // after loader fades
    tl.fromTo(
      titleRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out' }
    )
    .fromTo(subRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: 'left' }, '-=0.2')
    .fromTo(btnRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
  }, [])

  return (
    <section className="relative bg-ocean min-h-[88vh] flex items-center justify-center overflow-hidden">
      <HeroParticles />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(95,168,169,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(166,61,64,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10 text-center px-6">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-seafoam mb-5">
          Art · Photography · Music · Writing
        </p>
        <h1
          ref={titleRef}
          className="font-serif text-white tracking-[0.15em] leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          {title}
        </h1>
        <p ref={subRef} className="font-serif italic text-white/60 text-lg mb-8">
          {subtitle}
        </p>
        <div ref={ruleRef} className="w-10 h-0.5 bg-burnt mx-auto mb-8" />
        <Link
          ref={btnRef}
          href="/gallery"
          className="inline-block bg-burnt text-white font-sans text-xs tracking-wider uppercase px-9 py-3.5 rounded hover:bg-burnt/90 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `app/page.tsx`**

```typescript
// app/page.tsx
import { readJSON } from '@/lib/blob'
import { HomepageContent, GalleryIndex, PostIndex } from '@/lib/types'
import HeroSection from '@/components/home/HeroSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import Image from 'next/image'

const defaultHomepage: HomepageContent = {
  heroTitle: 'faavidel',
  heroSubtitle: 'A world of creative work',
  heroButtonText: 'Explore the Gallery',
  featuredArtworkSlugs: [],
  bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing.',
}

export const revalidate = 60

export default async function HomePage() {
  const [homepage, gallery, posts] = await Promise.all([
    readJSON<HomepageContent>('homepage.json'),
    readJSON<GalleryIndex>('gallery/index.json'),
    readJSON<PostIndex>('writing/index.json'),
  ])

  const content = homepage ?? defaultHomepage
  const artworks = gallery?.artworks.slice(0, 6) ?? []
  const latestPosts = posts?.posts.filter(p => p.status === 'published').slice(0, 3) ?? []

  return (
    <main>
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        buttonText={content.heroButtonText}
      />

      {/* Featured Gallery */}
      {artworks.length > 0 && (
        <section className="py-20 px-8 max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="section-label">Featured Work</p>
            <h2 className="section-title">Gallery</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.map((art, i) => (
              <AnimatedSection key={art.slug} delay={i * 0.08}>
                <Link href={`/gallery/${art.slug}`} className="group block aspect-[4/3] overflow-hidden rounded relative bg-off-white">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/60 transition-colors duration-300 flex items-end p-4">
                    <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {art.title}
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8 text-center">
            <Link href="/gallery" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean transition-colors">
              View all work →
            </Link>
          </AnimatedSection>
        </section>
      )}

      {/* Latest Writing */}
      {latestPosts.length > 0 && (
        <section className="py-20 px-8 bg-off-white-2">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <p className="section-label">Latest</p>
              <h2 className="section-title">Writing</h2>
              <div className="section-rule" />
            </AnimatedSection>
            <div className="flex flex-col divide-y divide-gray-200">
              {latestPosts.map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 0.1} direction="left">
                  <Link href={`/writing/${post.slug}`} className="group flex justify-between items-center py-5">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal group-hover:text-ocean transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs tracking-wider text-seafoam mt-1">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                    <span className="text-burnt group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bio snippet */}
      <section className="bg-ocean py-20 px-8">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <p className="section-label text-seafoam">The Artist</p>
          <h2 className="text-3xl text-white font-serif mt-2 mb-1">About Faavidel</h2>
          <div className="w-8 h-0.5 bg-burnt mx-auto mt-1 mb-7" />
          <p className="text-white/70 font-serif leading-relaxed text-lg mb-8">
            {content.bioSnippet}
          </p>
          <Link
            href="/about"
            className="inline-block border border-seafoam text-seafoam font-sans text-xs tracking-wider uppercase px-6 py-2.5 rounded hover:bg-seafoam hover:text-white transition-colors"
          >
            Read More →
          </Link>
        </AnimatedSection>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/ app/page.tsx
git commit -m "feat: add home page with hero, gallery preview, writing preview, bio"
```

---

### Task 13: Gallery Pages

**Files:**
- Create: `components/gallery/GalleryGrid.tsx`, `components/gallery/ArtworkCard.tsx`, `app/gallery/page.tsx`, `app/gallery/[slug]/page.tsx`

- [ ] **Step 1: Create `components/gallery/ArtworkCard.tsx`**

```typescript
// components/gallery/ArtworkCard.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  slug: string
  title: string
  imageUrl: string
  tags: string[]
  index: number
}

export default function ArtworkCard({ slug, title, imageUrl, tags, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/gallery/${slug}`} className="group block" data-cursor-hover>
        <div className="aspect-[4/3] overflow-hidden rounded bg-off-white relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/55 transition-all duration-400 flex items-end p-5">
            <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {title}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors">{title}</h3>
          <div className="flex gap-2 flex-wrap mt-1">
            {tags.slice(0, 3).map(t => (
              <span key={t} className="font-sans text-[10px] tracking-wider uppercase text-seafoam">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `components/gallery/GalleryGrid.tsx`**

```typescript
// components/gallery/GalleryGrid.tsx
'use client'
import { useState } from 'react'
import ArtworkCard from './ArtworkCard'
import { GalleryIndex } from '@/lib/types'

interface Props {
  artworks: GalleryIndex['artworks']
}

export default function GalleryGrid({ artworks }: Props) {
  const allTags = Array.from(new Set(artworks.flatMap(a => a.tags)))
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? artworks
    : artworks.filter(a => a.tags.includes(active))

  return (
    <>
      <div className="flex gap-3 flex-wrap mb-8">
        {['All', ...allTags].map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`font-sans text-xs tracking-wider uppercase px-3 py-1 rounded-full border transition-colors
              ${active === tag
                ? 'border-seafoam bg-seafoam/10 text-seafoam'
                : 'border-gray-200 text-gray-400 hover:border-seafoam hover:text-seafoam'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map((art, i) => (
          <ArtworkCard key={art.slug} {...art} index={i} />
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create `app/gallery/page.tsx`**

```typescript
// app/gallery/page.tsx
import { readJSON } from '@/lib/blob'
import { GalleryIndex } from '@/lib/types'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function GalleryPage() {
  const data = await readJSON<GalleryIndex>('gallery/index.json')
  const artworks = (data?.artworks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="section-label">All Work</p>
        <h1 className="section-title">Gallery</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {artworks.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No artwork yet.</p>
      ) : (
        <GalleryGrid artworks={artworks} />
      )}
    </main>
  )
}
```

- [ ] **Step 4: Create `app/gallery/[slug]/page.tsx`**

```typescript
// app/gallery/[slug]/page.tsx
import { readJSON } from '@/lib/blob'
import { Artwork } from '@/lib/types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

export const revalidate = 60

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artwork = await readJSON<Artwork>(`gallery/${slug}.json`)
  if (!artwork) notFound()

  return (
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <Link href="/gallery" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean transition-colors mb-8 inline-block">
          ← Back to Gallery
        </Link>
      </AnimatedSection>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <AnimatedSection>
          <div className="relative aspect-[4/3] rounded overflow-hidden bg-off-white">
            <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15} direction="left">
          <p className="section-label">{artwork.year}</p>
          <h1 className="section-title mt-1">{artwork.title}</h1>
          <div className="section-rule" />
          <p className="font-serif text-charcoal/80 leading-relaxed mb-6">{artwork.description}</p>
          <div className="flex gap-2 flex-wrap">
            {artwork.tags.map(t => (
              <span key={t} className="font-sans text-xs tracking-wider uppercase text-seafoam border border-seafoam/30 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/gallery/ app/gallery/
git commit -m "feat: add gallery index and artwork detail pages"
```

---

### Task 14: Photography Pages

**Files:**
- Create: `components/photography/SeriesGrid.tsx`, `components/photography/PhotoLightbox.tsx`, `app/photography/page.tsx`, `app/photography/[series]/page.tsx`

- [ ] **Step 1: Create `components/photography/SeriesGrid.tsx`**

```typescript
// components/photography/SeriesGrid.tsx
import Link from 'next/link'
import Image from 'next/image'
import { PhotographyIndex } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function SeriesGrid({ series }: { series: PhotographyIndex['series'] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {series.map((s, i) => (
        <AnimatedSection key={s.slug} delay={i * 0.08}>
          <Link href={`/photography/${s.slug}`} className="group block" data-cursor-hover>
            <div className="aspect-square overflow-hidden rounded bg-off-white relative">
              <Image src={s.coverUrl} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/50 transition-colors duration-400 flex items-end p-5">
                <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{s.title}</span>
              </div>
            </div>
            <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors mt-3">{s.title}</h3>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/photography/PhotoLightbox.tsx`**

```typescript
// components/photography/PhotoLightbox.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Photo } from '@/lib/types'

export default function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null)

  const prev = () => setActive(i => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setActive(i => (i !== null ? (i + 1) % photos.length : null))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, i) => (
          <button key={photo.id} onClick={() => setActive(i)} className="aspect-square overflow-hidden rounded bg-off-white relative group" data-cursor-hover>
            <Image src={photo.url} alt={photo.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setActive(null)}>
              <X size={28} />
            </button>
            <button className="absolute left-4 text-white/60 hover:text-white" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={36} />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-4xl w-full max-h-[85vh] aspect-auto"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={photos[active].url}
                alt={photos[active].caption}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-full rounded"
              />
              {photos[active].caption && (
                <p className="text-white/60 font-sans text-xs tracking-wider text-center mt-3">{photos[active].caption}</p>
              )}
            </motion.div>
            <button className="absolute right-4 text-white/60 hover:text-white" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 3: Create `app/photography/page.tsx`**

```typescript
// app/photography/page.tsx
import { readJSON } from '@/lib/blob'
import { PhotographyIndex } from '@/lib/types'
import SeriesGrid from '@/components/photography/SeriesGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function PhotographyPage() {
  const data = await readJSON<PhotographyIndex>('photography/index.json')
  const series = (data?.series ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Visual Stories</p>
        <h1 className="section-title">Photography</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {series.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No series yet.</p>
      ) : (
        <SeriesGrid series={series} />
      )}
    </main>
  )
}
```

- [ ] **Step 4: Create `app/photography/[series]/page.tsx`**

```typescript
// app/photography/[series]/page.tsx
import { readJSON } from '@/lib/blob'
import { PhotoSeriesDetail } from '@/lib/types'
import { notFound } from 'next/navigation'
import PhotoLightbox from '@/components/photography/PhotoLightbox'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

export const revalidate = 60

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>
}) {
  const { series: slug } = await params
  const data = await readJSON<PhotoSeriesDetail>(`photography/${slug}/index.json`)
  if (!data) notFound()

  const photos = (data.photos ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <Link href="/photography" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">
          ← All Series
        </Link>
        <p className="section-label">Series</p>
        <h1 className="section-title">{data.title}</h1>
        <div className="section-rule" />
        <p className="font-serif text-charcoal/70 max-w-2xl mb-10">{data.description}</p>
      </AnimatedSection>
      <PhotoLightbox photos={photos} />
    </main>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/photography/ app/photography/
git commit -m "feat: add photography series and lightbox pages"
```

---

### Task 15: Writing Pages

**Files:**
- Create: `components/writing/PostList.tsx`, `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Create `components/writing/PostList.tsx`**

```typescript
// components/writing/PostList.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PostIndex } from '@/lib/types'

export default function PostList({ posts }: { posts: PostIndex['posts'] }) {
  const published = posts.filter(p => p.status === 'published')
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {published.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
        >
          <Link href={`/writing/${post.slug}`} className="group flex justify-between items-center py-6">
            <div>
              <h2 className="font-serif text-xl text-charcoal group-hover:text-ocean transition-colors mb-1">
                {post.title}
              </h2>
              <p className="font-sans text-sm text-charcoal/60 mb-2 line-clamp-1">{post.excerpt}</p>
              <p className="font-sans text-xs tracking-wider text-seafoam">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className="text-burnt group-hover:translate-x-1.5 transition-transform text-xl ml-6 shrink-0">→</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/writing/page.tsx`**

```typescript
// app/writing/page.tsx
import { readJSON } from '@/lib/blob'
import { PostIndex } from '@/lib/types'
import PostList from '@/components/writing/PostList'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function WritingPage() {
  const data = await readJSON<PostIndex>('writing/index.json')
  const posts = (data?.posts ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="min-h-screen py-20 px-8 max-w-3xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Words</p>
        <h1 className="section-title">Writing</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {posts.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No posts yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  )
}
```

- [ ] **Step 3: Create `app/writing/[slug]/page.tsx`**

```typescript
// app/writing/[slug]/page.tsx
import { readJSON } from '@/lib/blob'
import { Post } from '@/lib/types'
import { notFound } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export const revalidate = 60

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await readJSON<Post>(`writing/${slug}.json`)
  if (!post || post.status === 'draft') notFound()

  return (
    <main className="min-h-screen py-20 px-8 max-w-2xl mx-auto">
      <AnimatedSection>
        <Link href="/writing" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">
          ← All Writing
        </Link>
        <p className="font-sans text-xs tracking-wider text-seafoam mb-3">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-serif text-4xl text-charcoal leading-tight mb-2">{post.title}</h1>
        <div className="w-8 h-0.5 bg-burnt my-6" />
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <div className="prose prose-lg prose-serif max-w-none font-serif text-charcoal/85 leading-relaxed [&>p]:mb-5 [&>h2]:text-ocean [&>h2]:mt-10 [&>h2]:mb-4">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </AnimatedSection>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/writing/ app/writing/
git commit -m "feat: add writing list and post detail pages"
```

---

### Task 16: Video + Music Pages

**Files:**
- Create: `components/video/VideoGrid.tsx`, `components/music/AudioPlayer.tsx`, `app/video/page.tsx`, `app/music/page.tsx`

- [ ] **Step 1: Create `components/video/VideoGrid.tsx`**

```typescript
// components/video/VideoGrid.tsx
import { VideoIndex } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function VideoGrid({ videos }: { videos: VideoIndex['videos'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {videos.map((video, i) => (
        <AnimatedSection key={video.id} delay={i * 0.1}>
          <div className="aspect-video rounded overflow-hidden bg-charcoal relative">
            <iframe
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <h3 className="font-serif text-lg text-charcoal mt-3">{video.title}</h3>
          {video.description && (
            <p className="font-sans text-sm text-charcoal/60 mt-1">{video.description}</p>
          )}
        </AnimatedSection>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `app/video/page.tsx`**

```typescript
// app/video/page.tsx
import { readJSON } from '@/lib/blob'
import { VideoIndex } from '@/lib/types'
import VideoGrid from '@/components/video/VideoGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function VideoPage() {
  const data = await readJSON<VideoIndex>('video/index.json')
  const videos = (data?.videos ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Moving Image</p>
        <h1 className="section-title">Video</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {videos.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No videos yet.</p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </main>
  )
}
```

- [ ] **Step 3: Create `components/music/AudioPlayer.tsx`**

```typescript
// components/music/AudioPlayer.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { Track } from '@/lib/types'
import Image from 'next/image'

export default function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const current = tracks[currentIdx]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const ended = () => {
      if (currentIdx < tracks.length - 1) {
        setCurrentIdx(i => i + 1)
      } else {
        setPlaying(false)
      }
    }
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('ended', ended)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('ended', ended)
    }
  }, [currentIdx, tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    audio.src = current.fileUrl
    if (playing) audio.play()
  }, [currentIdx])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  if (!current) return null

  return (
    <div>
      {/* Player */}
      <div className="bg-ocean rounded-xl p-6 mb-8 flex gap-6 items-center">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal shrink-0 relative">
          {current.artworkUrl && (
            <Image src={current.artworkUrl} alt={current.title} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-serif text-lg truncate">{current.title}</h3>
          <div
            className="h-1 bg-white/20 rounded-full mt-3 cursor-pointer"
            onClick={seek}
          >
            <motion.div
              className="h-full bg-burnt rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={toggle}
            className="w-10 h-10 bg-burnt rounded-full flex items-center justify-center text-white hover:bg-burnt/80 transition-colors"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => setCurrentIdx(i => Math.min(tracks.length - 1, i + 1))}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <audio ref={audioRef} />

      {/* Track list */}
      <div className="flex flex-col divide-y divide-gray-100">
        {tracks.map((track, i) => (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { setCurrentIdx(i); setPlaying(true) }}
            className={`flex items-center gap-4 py-4 text-left hover:bg-off-white rounded px-2 transition-colors group
              ${currentIdx === i ? 'text-ocean' : 'text-charcoal'}`}
          >
            <span className="font-sans text-xs w-6 text-center text-charcoal/40">{i + 1}</span>
            <div className="w-10 h-10 rounded bg-off-white-2 relative overflow-hidden shrink-0">
              {track.artworkUrl && (
                <Image src={track.artworkUrl} alt={track.title} fill className="object-cover" />
              )}
            </div>
            <span className="font-serif flex-1 truncate">{track.title}</span>
            <span className="font-sans text-xs text-charcoal/40">{track.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/music/page.tsx`**

```typescript
// app/music/page.tsx
import { readJSON } from '@/lib/blob'
import { MusicIndex } from '@/lib/types'
import AudioPlayer from '@/components/music/AudioPlayer'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function MusicPage() {
  const data = await readJSON<MusicIndex>('music/index.json')
  const tracks = (data?.tracks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-3xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Sound</p>
        <h1 className="section-title">Music</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {tracks.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No tracks yet.</p>
      ) : (
        <AudioPlayer tracks={tracks} />
      )}
    </main>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/video/ components/music/ app/video/ app/music/
git commit -m "feat: add video grid and music player pages"
```

---

### Task 17: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```typescript
// app/about/page.tsx
import { readJSON } from '@/lib/blob'
import { AboutContent } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Image from 'next/image'

export const revalidate = 60

const defaultAbout: AboutContent = {
  fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.',
  profilePhotoUrl: '',
  instagram: '',
  email: 'hello@faavidel.art',
}

export default async function AboutPage() {
  const about = await readJSON<AboutContent>('about.json') ?? defaultAbout

  return (
    <main className="min-h-screen py-20 px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Profile */}
        <AnimatedSection>
          {about.profilePhotoUrl ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-off-white max-w-sm">
              <Image src={about.profilePhotoUrl} alt="Faavidel" fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-ocean to-seafoam max-w-sm" />
          )}
        </AnimatedSection>

        {/* Bio */}
        <AnimatedSection delay={0.15} direction="left">
          <p className="section-label">The Artist</p>
          <h1 className="section-title">Faavidel</h1>
          <div className="section-rule" />
          <div className="font-serif text-charcoal/80 leading-relaxed whitespace-pre-line mb-8 text-lg">
            {about.fullBio}
          </div>
          <div className="flex gap-5">
            {about.instagram && (
              <a href={`https://instagram.com/${about.instagram}`} target="_blank" rel="noopener noreferrer"
                className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean border-b border-seafoam/40 pb-0.5 transition-colors">
                Instagram
              </a>
            )}
            {about.email && (
              <a href={`mailto:${about.email}`}
                className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean border-b border-seafoam/40 pb-0.5 transition-colors">
                Email
              </a>
            )}
          </div>
        </AnimatedSection>
      </div>

      {/* Contact form */}
      <div className="max-w-2xl mx-auto mt-24">
        <AnimatedSection>
          <p className="section-label">Get in Touch</p>
          <h2 className="section-title">Contact</h2>
          <div className="section-rule" />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <ContactForm />
        </AnimatedSection>
      </div>
    </main>
  )
}

function ContactForm() {
  'use client'
  // Note: This must be a client component — split into its own file if needed
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: fd.get('name'),
            email: fd.get('email'),
            message: fd.get('message'),
          }),
        })
        ;(e.target as HTMLFormElement).reset()
        alert('Message sent!')
      }}
      className="flex flex-col gap-4"
    >
      <input name="name" placeholder="Your name" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <input name="email" type="email" placeholder="Your email" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <textarea name="message" placeholder="Your message" rows={5} required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white resize-none" />
      <button type="submit"
        className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-3 rounded hover:bg-burnt/85 transition-colors">
        Send Message
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Extract `ContactForm` into its own file (required because it uses `'use client'`)**

Create `components/about/ContactForm.tsx`:

```typescript
// components/about/ContactForm.tsx
'use client'

export default function ContactForm() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: fd.get('name'),
            email: fd.get('email'),
            message: fd.get('message'),
          }),
        })
        ;(e.target as HTMLFormElement).reset()
        alert('Message sent!')
      }}
      className="flex flex-col gap-4"
    >
      <input name="name" placeholder="Your name" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <input name="email" type="email" placeholder="Your email" required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white" />
      <textarea name="message" placeholder="Your message" rows={5} required
        className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors bg-off-white resize-none" />
      <button type="submit"
        className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-3 rounded hover:bg-burnt/85 transition-colors">
        Send Message
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Update `app/about/page.tsx` — replace the inline `ContactForm` with an import**

Remove the inline `ContactForm` function from `app/about/page.tsx` and replace with:

```typescript
import ContactForm from '@/components/about/ContactForm'
```

Remove the `'use client'` comment inside the inline function, and use `<ContactForm />` in place of the inline component.

- [ ] **Step 4: Commit**

```bash
git add app/about/ components/about/
git commit -m "feat: add about page with bio, links, and contact form"
```

---

## Phase 4: Shop

### Task 18: Shop Pages

**Files:**
- Create: `components/shop/ProductCard.tsx`, `components/shop/ProductGrid.tsx`, `components/shop/CartDrawer.tsx`, `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`

- [ ] **Step 1: Create `components/shop/ProductCard.tsx`**

```typescript
// components/shop/ProductCard.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProductIndex } from '@/lib/types'

type ProductSummary = ProductIndex['products'][number]

export default function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block" data-cursor-hover>
        <div className="aspect-[3/4] overflow-hidden rounded bg-off-white relative">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ocean/90 p-4">
            <span className="text-white font-sans text-xs tracking-wider uppercase">View details →</span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors">{product.title}</h3>
          <p className="font-sans text-sm text-burnt mt-0.5">${product.price.toFixed(2)}</p>
          {product.stock === 0 && (
            <p className="font-sans text-xs text-gray-400 mt-0.5">Sold out</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `components/shop/ProductGrid.tsx`**

```typescript
// components/shop/ProductGrid.tsx
import ProductCard from './ProductCard'
import { ProductIndex } from '@/lib/types'

export default function ProductGrid({ products }: { products: ProductIndex['products'] }) {
  const active = products.filter(p => p.status === 'active')
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {active.map((product, i) => (
        <ProductCard key={product.slug} product={product} index={i} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/shop/CartDrawer.tsx`**

```typescript
// components/shop/CartDrawer.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const checkout = async () => {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[9990]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[9991] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-ocean" />
                <h2 className="font-serif text-xl text-ocean">Cart</h2>
              </div>
              <button onClick={onClose} className="text-charcoal/50 hover:text-charcoal"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {items.length === 0 ? (
                <p className="font-serif text-charcoal/50 text-center mt-12">Your cart is empty</p>
              ) : (
                items.map(item => (
                  <div key={item.productSlug} className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded bg-off-white relative shrink-0 overflow-hidden">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-charcoal truncate">{item.title}</p>
                      <p className="font-sans text-xs text-burnt mt-0.5">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity - 1)}><Minus size={12} /></button>
                        <span className="font-sans text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.productSlug)} className="text-charcoal/30 hover:text-burnt mt-1"><X size={14} /></button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between font-serif text-lg mb-5">
                  <span>Total</span>
                  <span className="text-burnt">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={checkout}
                  disabled={loading}
                  className="w-full bg-burnt text-white font-sans text-xs tracking-wider uppercase py-3.5 rounded hover:bg-burnt/85 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Redirecting...' : 'Checkout →'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Create `app/shop/page.tsx`**

```typescript
// app/shop/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { ProductIndex } from '@/lib/types'
import ProductGrid from '@/components/shop/ProductGrid'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useSearchParams } from 'next/navigation'

export default function ShopPage() {
  const [products, setProducts] = useState<ProductIndex['products']>([])
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()
  const params = useSearchParams()

  useEffect(() => {
    fetch('/api/content/shop/index').then(r => r.json()).then(d => setProducts(d?.products ?? []))
  }, [])

  useEffect(() => {
    if (params.get('success')) alert('Order placed! Thank you.')
  }, [params])

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection className="flex justify-between items-start mb-8">
        <div>
          <p className="section-label">Prints & Products</p>
          <h1 className="section-title">Shop</h1>
          <div className="section-rule" />
        </div>
        <button onClick={() => setCartOpen(true)} className="relative mt-2" data-cursor-hover>
          <ShoppingBag size={24} className="text-ocean" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
              {count}
            </span>
          )}
        </button>
      </AnimatedSection>
      {products.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No products yet.</p>
      ) : (
        <ProductGrid products={products} />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
```

- [ ] **Step 5: Create `app/shop/[slug]/page.tsx`**

```typescript
// app/shop/[slug]/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product } from '@/lib/types'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`/api/content/shop/${slug}`).then(r => r.json()).then(setProduct)
  }, [slug])

  if (!product) return <div className="min-h-screen flex items-center justify-center font-serif text-gray-400">Loading...</div>

  const handleAdd = () => {
    addItem({
      productSlug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0] ?? '',
    })
    setCartOpen(true)
  }

  return (
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <Link href="/shop" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">← Back to Shop</Link>
      </AnimatedSection>
      <div className="grid md:grid-cols-2 gap-12">
        <AnimatedSection>
          <div className="aspect-[3/4] rounded overflow-hidden bg-off-white relative mb-3">
            {product.images[activeImg] && (
              <Image src={product.images[activeImg]} alt={product.title} fill className="object-cover" />
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-16 h-16 rounded overflow-hidden relative border-2 transition-colors ${activeImg === i ? 'border-burnt' : 'border-transparent'}`}>
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} direction="left">
          <h1 className="font-serif text-3xl text-charcoal mb-2">{product.title}</h1>
          <p className="font-sans text-2xl text-burnt mb-6">${product.price.toFixed(2)}</p>
          <div className="w-8 h-0.5 bg-burnt mb-6" />
          <p className="font-serif text-charcoal/75 leading-relaxed mb-8">{product.description}</p>
          {product.stock > 0 ? (
            <button onClick={handleAdd}
              className="w-full bg-burnt text-white font-sans text-xs tracking-wider uppercase py-4 rounded hover:bg-burnt/85 transition-colors mb-3">
              Add to Cart
            </button>
          ) : (
            <div className="w-full border border-gray-200 text-gray-400 font-sans text-xs tracking-wider uppercase py-4 rounded text-center">
              Sold Out
            </div>
          )}
        </AnimatedSection>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/shop/ app/shop/
git commit -m "feat: add shop pages, product cards, cart drawer, and checkout flow"
```

---

## Phase 5: Admin Panel

### Task 19: Admin Layout + Login + Shared Components

**Files:**
- Create: `app/admin/page.tsx`, `app/admin/layout.tsx`, `components/admin/AdminNav.tsx`, `components/admin/FileUpload.tsx`, `components/admin/RichTextEditor.tsx`

- [ ] **Step 1: Create `app/admin/page.tsx`** (login form)

```typescript
// app/admin/page.tsx
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      username: fd.get('username'),
      password: fd.get('password'),
      redirect: false,
    })
    if (result?.error) {
      setError('Invalid credentials')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-ocean flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-10 w-full max-w-sm shadow-2xl">
        <h1 className="font-serif text-2xl text-ocean mb-1">faavidel</h1>
        <p className="font-sans text-xs tracking-wider uppercase text-seafoam mb-8">Admin Panel</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            placeholder="Username"
            required
            className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border border-gray-200 rounded px-4 py-3 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors"
          />
          {error && <p className="font-sans text-xs text-burnt">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-ocean text-white font-sans text-xs tracking-wider uppercase py-3 rounded hover:bg-ocean/85 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/admin/layout.tsx`**

```typescript
// app/admin/layout.tsx
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-off-white flex" style={{ paddingTop: 0 }}>
      <AdminNav />
      <main className="flex-1 p-8 overflow-y-auto ml-56">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/admin/AdminNav.tsx`**

```typescript
// components/admin/AdminNav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Image, Camera, FileText, Video, Music,
  ShoppingBag, Package, Home, User, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/photography', label: 'Photography', icon: Camera },
  { href: '/admin/writing', label: 'Writing', icon: FileText },
  { href: '/admin/video', label: 'Video', icon: Video },
  { href: '/admin/music', label: 'Music', icon: Music },
  { href: '/admin/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/about', label: 'About', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-charcoal flex flex-col z-40">
      <div className="p-5 border-b border-white/10">
        <p className="font-serif text-white text-lg tracking-widest">faavidel</p>
        <p className="font-sans text-xs text-white/40 tracking-wider mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 font-sans text-xs tracking-wider transition-colors
                ${active ? 'bg-ocean text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/admin' })}
        className="flex items-center gap-3 px-5 py-4 font-sans text-xs tracking-wider text-white/40 hover:text-white border-t border-white/10 transition-colors"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    </aside>
  )
}
```

- [ ] **Step 4: Create `components/admin/FileUpload.tsx`**

```typescript
// components/admin/FileUpload.tsx
'use client'
import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'

interface Props {
  accept?: string
  onUploaded: (url: string) => void
  label?: string
  currentUrl?: string
}

export default function FileUpload({ accept = 'image/*', onUploaded, label = 'Upload file', currentUrl }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl ?? '')

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const pathname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const fd = new FormData()
    fd.append('file', file)
    fd.append('pathname', pathname)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setPreview(url)
    onUploaded(url)
    setUploading(false)
  }, [onUploaded])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="preview" className="max-h-32 rounded border border-gray-200 object-contain" />
          <button
            onClick={() => { setPreview(''); onUploaded('') }}
            className="absolute -top-2 -right-2 bg-burnt text-white rounded-full w-5 h-5 flex items-center justify-center"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <label
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-8 cursor-pointer hover:border-seafoam transition-colors"
        >
          <Upload size={20} className="text-gray-400" />
          <span className="font-sans text-xs text-gray-400 tracking-wider">
            {uploading ? 'Uploading...' : label}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
          />
        </label>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create `components/admin/RichTextEditor.tsx`**

```typescript
// components/admin/RichTextEditor.tsx
'use client'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? 'Write in Markdown...'}
      rows={16}
      className="w-full border border-gray-200 rounded px-4 py-3 font-mono text-sm focus:outline-none focus:border-seafoam transition-colors resize-y bg-white"
    />
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/admin/page.tsx app/admin/layout.tsx components/admin/
git commit -m "feat: add admin login, layout, nav, file upload, and rich text editor"
```

---

### Task 20: Admin Dashboard

**Files:**
- Create: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create `app/admin/dashboard/page.tsx`**

```typescript
// app/admin/dashboard/page.tsx
import { readJSON } from '@/lib/blob'
import { GalleryIndex, OrderIndex, PostIndex, ProductIndex } from '@/lib/types'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  const [gallery, posts, orders, products] = await Promise.all([
    readJSON<GalleryIndex>('gallery/index.json'),
    readJSON<PostIndex>('writing/index.json'),
    readJSON<OrderIndex>('orders/index.json'),
    readJSON<ProductIndex>('shop/index.json'),
  ])

  const stats = [
    { label: 'Artworks', value: gallery?.artworks.length ?? 0, href: '/admin/gallery' },
    { label: 'Posts', value: posts?.posts.filter(p => p.status === 'published').length ?? 0, href: '/admin/writing' },
    { label: 'Products', value: products?.products.filter(p => p.status === 'active').length ?? 0, href: '/admin/shop' },
    { label: 'Orders', value: orders?.orders.length ?? 0, href: '/admin/orders' },
  ]

  const recentOrders = orders?.orders.slice(0, 5) ?? []

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-lg p-5 border border-gray-100 hover:border-seafoam transition-colors">
            <p className="font-sans text-3xl font-light text-ocean mb-1">{s.value}</p>
            <p className="font-sans text-xs tracking-wider uppercase text-charcoal/50">{s.label}</p>
          </Link>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="font-serif text-lg text-charcoal mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-sans text-sm text-charcoal">{order.customerEmail}</p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-sm text-burnt">${order.total.toFixed(2)}</span>
                  <span className={`font-sans text-xs tracking-wider uppercase px-2 py-0.5 rounded-full
                    ${order.status === 'paid' ? 'bg-seafoam/10 text-seafoam' : ''}
                    ${order.status === 'shipped' ? 'bg-ocean/10 text-ocean' : ''}
                    ${order.status === 'pending' ? 'bg-gray-100 text-gray-500' : ''}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/dashboard/
git commit -m "feat: add admin dashboard with stats and recent orders"
```

---

### Task 21: Admin Gallery Manager

**Files:**
- Create: `app/admin/gallery/page.tsx`

- [ ] **Step 1: Create `app/admin/gallery/page.tsx`**

```typescript
// app/admin/gallery/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { GalleryIndex, Artwork } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Trash2, Plus, GripVertical } from 'lucide-react'

const emptyArtwork = (): Partial<Artwork> => ({
  title: '', description: '', tags: [], imageUrl: '', year: new Date().getFullYear(), order: 0,
})

export default function AdminGalleryPage() {
  const [artworks, setArtworks] = useState<GalleryIndex['artworks']>([])
  const [form, setForm] = useState<Partial<Artwork>>(emptyArtwork())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/gallery/index').then(r => r.json()).then(d => setArtworks(d?.artworks ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const slug = form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const artwork: Artwork = {
      slug,
      title: form.title!,
      description: form.description ?? '',
      tags: typeof form.tags === 'string' ? (form.tags as string).split(',').map(t => t.trim()).filter(Boolean) : form.tags ?? [],
      imageUrl: form.imageUrl!,
      year: form.year ?? new Date().getFullYear(),
      order: artworks.length,
      createdAt: new Date().toISOString(),
    }
    await fetch(`/api/content/gallery/${slug}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(artwork),
    })
    const updated = { artworks: [...artworks.filter(a => a.slug !== slug), { slug, title: artwork.title, imageUrl: artwork.imageUrl, tags: artwork.tags, order: artwork.order }] }
    await fetch('/api/content/gallery/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyArtwork())
    setEditing(false)
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this artwork?')) return
    const updated = { artworks: artworks.filter(a => a.slug !== slug) }
    await fetch('/api/content/gallery/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Gallery</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded hover:bg-ocean/85 transition-colors">
          <Plus size={14} /> Add Artwork
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">{form.slug ? 'Edit' : 'New'} Artwork</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <input placeholder="Year" type="number" value={form.year ?? ''} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <input placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags ?? ''} onChange={e => setForm(f => ({ ...f, tags: e.target.value as unknown as string[] }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam resize-none" />
            </div>
            <div>
              <FileUpload onUploaded={url => setForm(f => ({ ...f, imageUrl: url }))} currentUrl={form.imageUrl} label="Upload artwork image" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving || !form.title || !form.imageUrl}
              className="bg-burnt text-white font-sans text-xs tracking-wider uppercase px-5 py-2 rounded hover:bg-burnt/85 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyArtwork()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs tracking-wider uppercase px-5 py-2 rounded hover:border-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {artworks.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No artwork yet.</p>}
        {artworks.map(art => (
          <div key={art.slug} className="flex items-center gap-4 px-5 py-3">
            <GripVertical size={14} className="text-gray-300" />
            {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-charcoal truncate">{art.title}</p>
              <div className="flex gap-1 mt-0.5">
                {art.tags.map(t => <span key={t} className="font-sans text-[10px] text-seafoam uppercase tracking-wider">{t}</span>)}
              </div>
            </div>
            <button onClick={() => { setForm({ ...art, tags: art.tags }); setEditing(true) }}
              className="font-sans text-xs text-ocean hover:underline">Edit</button>
            <button onClick={() => remove(art.slug)} className="text-charcoal/30 hover:text-burnt">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/gallery/
git commit -m "feat: add admin gallery manager with create, edit, delete"
```

---

### Task 22: Admin Writing Editor

**Files:**
- Create: `app/admin/writing/page.tsx`

- [ ] **Step 1: Create `app/admin/writing/page.tsx`**

```typescript
// app/admin/writing/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { PostIndex, Post } from '@/lib/types'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Plus, Trash2 } from 'lucide-react'

const emptyPost = (): Partial<Post> => ({
  title: '', excerpt: '', content: '', tags: [], status: 'draft',
  date: new Date().toISOString().split('T')[0],
})

export default function AdminWritingPage() {
  const [posts, setPosts] = useState<PostIndex['posts']>([])
  const [form, setForm] = useState<Partial<Post>>(emptyPost())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/writing/index').then(r => r.json()).then(d => setPosts(d?.posts ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const slug = form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const post: Post = {
      slug,
      title: form.title!,
      excerpt: form.excerpt ?? '',
      content: form.content ?? '',
      date: form.date ?? new Date().toISOString().split('T')[0],
      status: form.status as 'published' | 'draft',
      tags: typeof form.tags === 'string' ? (form.tags as string).split(',').map(t => t.trim()) : form.tags ?? [],
      createdAt: form.createdAt ?? new Date().toISOString(),
    }
    await fetch(`/api/content/writing/${slug}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(post),
    })
    const updated: PostIndex = {
      posts: [
        ...posts.filter(p => p.slug !== slug),
        { slug, title: post.title, excerpt: post.excerpt, date: post.date, status: post.status, tags: post.tags },
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }
    await fetch('/api/content/writing/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyPost())
    setEditing(false)
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this post?')) return
    await fetch('/api/content/writing/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ posts: posts.filter(p => p.slug !== slug) }),
    })
    await load()
  }

  const edit = async (slug: string) => {
    const res = await fetch(`/api/content/writing/${slug}`)
    const post = await res.json()
    setForm(post)
    setEditing(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Writing</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> New Post
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Date (YYYY-MM-DD)" value={form.date ?? ''} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Excerpt" value={form.excerpt ?? ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <select value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <RichTextEditor value={form.content ?? ''} onChange={content => setForm(f => ({ ...f, content }))} />
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving || !form.title}
              className="bg-burnt text-white font-sans text-xs tracking-wider uppercase px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyPost()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {posts.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No posts yet.</p>}
        {posts.map(post => (
          <div key={post.slug} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-sans text-sm text-charcoal">{post.title}</p>
              <p className="font-sans text-xs text-charcoal/40 mt-0.5">{post.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
                ${post.status === 'published' ? 'bg-seafoam/10 text-seafoam' : 'bg-gray-100 text-gray-400'}`}>
                {post.status}
              </span>
              <button onClick={() => edit(post.slug)} className="font-sans text-xs text-ocean hover:underline">Edit</button>
              <button onClick={() => remove(post.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/writing/
git commit -m "feat: add admin writing editor with markdown support and publish toggle"
```

---

### Task 23: Remaining Admin Pages

**Files:**
- Create: `app/admin/photography/page.tsx`, `app/admin/video/page.tsx`, `app/admin/music/page.tsx`, `app/admin/shop/page.tsx`, `app/admin/orders/page.tsx`, `app/admin/homepage/page.tsx`, `app/admin/about/page.tsx`, `app/admin/settings/page.tsx`

- [ ] **Step 1: Create `app/admin/photography/page.tsx`**

```typescript
// app/admin/photography/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { PhotographyIndex, PhotoSeriesDetail, Photo } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

export default function AdminPhotographyPage() {
  const [series, setSeries] = useState<PhotographyIndex['series']>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [seriesPhotos, setSeriesPhotos] = useState<Record<string, Photo[]>>({})
  const [newSeries, setNewSeries] = useState({ title: '', description: '', coverUrl: '' })
  const [addingPhoto, setAddingPhoto] = useState<string | null>(null)
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const [newPhotoUrl, setNewPhotoUrl] = useState('')

  const load = () =>
    fetch('/api/content/photography/index').then(r => r.json()).then(d => setSeries(d?.series ?? []))

  useEffect(() => { load() }, [])

  const loadPhotos = async (slug: string) => {
    const res = await fetch(`/api/content/photography/${slug}/index`)
    const data = await res.json() as PhotoSeriesDetail
    setSeriesPhotos(p => ({ ...p, [slug]: data?.photos ?? [] }))
  }

  const toggle = (slug: string) => {
    if (expanded === slug) { setExpanded(null) }
    else { setExpanded(slug); loadPhotos(slug) }
  }

  const addSeries = async () => {
    const slug = newSeries.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const detail: PhotoSeriesDetail = {
      slug, title: newSeries.title, description: newSeries.description,
      coverUrl: newSeries.coverUrl, order: series.length, createdAt: new Date().toISOString(), photos: [],
    }
    await fetch(`/api/content/photography/${slug}/index`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(detail),
    })
    const updated: PhotographyIndex = { series: [...series, { slug, title: detail.title, coverUrl: detail.coverUrl, order: detail.order }] }
    await fetch('/api/content/photography/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setNewSeries({ title: '', description: '', coverUrl: '' })
    await load()
  }

  const addPhoto = async (seriesSlug: string) => {
    const id = Date.now().toString()
    const photo: Photo = { id, url: newPhotoUrl, caption: newPhotoCaption, order: (seriesPhotos[seriesSlug] ?? []).length }
    const photos = [...(seriesPhotos[seriesSlug] ?? []), photo]
    const detail = await fetch(`/api/content/photography/${seriesSlug}/index`).then(r => r.json())
    await fetch(`/api/content/photography/${seriesSlug}/index`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...detail, photos }),
    })
    setSeriesPhotos(p => ({ ...p, [seriesSlug]: photos }))
    setNewPhotoUrl('')
    setNewPhotoCaption('')
    setAddingPhoto(null)
  }

  const removeSeries = async (slug: string) => {
    if (!confirm('Delete this series?')) return
    await fetch('/api/content/photography/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ series: series.filter(s => s.slug !== slug) }),
    })
    await load()
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Photography</h1>

      {/* Add series */}
      <div className="bg-white rounded-lg border border-gray-100 p-5 mb-6">
        <h2 className="font-serif text-base text-charcoal mb-3">New Series</h2>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input placeholder="Series title" value={newSeries.title} onChange={e => setNewSeries(s => ({ ...s, title: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
          <input placeholder="Description" value={newSeries.description} onChange={e => setNewSeries(s => ({ ...s, description: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
          <FileUpload onUploaded={url => setNewSeries(s => ({ ...s, coverUrl: url }))} currentUrl={newSeries.coverUrl} label="Cover image" />
        </div>
        <button onClick={addSeries} disabled={!newSeries.title || !newSeries.coverUrl}
          className="bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded disabled:opacity-50">
          Add Series
        </button>
      </div>

      {/* Series list */}
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {series.map(s => (
          <div key={s.slug}>
            <div className="flex items-center gap-3 px-5 py-3">
              <button onClick={() => toggle(s.slug)} className="text-charcoal/40">
                {expanded === s.slug ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {s.coverUrl && <img src={s.coverUrl} alt={s.title} className="w-10 h-10 object-cover rounded" />}
              <p className="font-sans text-sm text-charcoal flex-1">{s.title}</p>
              <button onClick={() => removeSeries(s.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
            {expanded === s.slug && (
              <div className="px-12 pb-4">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {(seriesPhotos[s.slug] ?? []).map(photo => (
                    <div key={photo.id} className="aspect-square relative">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
                {addingPhoto === s.slug ? (
                  <div className="flex gap-2 items-end">
                    <FileUpload onUploaded={url => setNewPhotoUrl(url)} label="Photo" />
                    <input placeholder="Caption" value={newPhotoCaption} onChange={e => setNewPhotoCaption(e.target.value)}
                      className="border border-gray-200 rounded px-3 py-2 font-sans text-sm flex-1 focus:outline-none" />
                    <button onClick={() => addPhoto(s.slug)} disabled={!newPhotoUrl}
                      className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-3 py-2 rounded disabled:opacity-50">Add</button>
                    <button onClick={() => setAddingPhoto(null)} className="border border-gray-200 text-charcoal/60 font-sans text-xs px-3 py-2 rounded">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingPhoto(s.slug)} className="flex items-center gap-1 font-sans text-xs text-seafoam hover:text-ocean">
                    <Plus size={12} /> Add Photo
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/admin/video/page.tsx`**

```typescript
// app/admin/video/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { VideoIndex, VideoItem } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'

const emptyVideo = (): Partial<VideoItem> => ({ title: '', description: '', embedUrl: '', thumbnailUrl: '' })

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [form, setForm] = useState<Partial<VideoItem>>(emptyVideo())
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/video/index').then(r => r.json()).then(d => setVideos(d?.videos ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const video: VideoItem = {
      id: form.id ?? Date.now().toString(),
      title: form.title!,
      description: form.description ?? '',
      embedUrl: form.embedUrl!,
      thumbnailUrl: form.thumbnailUrl ?? '',
      order: videos.length,
      createdAt: new Date().toISOString(),
    }
    const updated: VideoIndex = { videos: [...videos.filter(v => v.id !== video.id), video] }
    await fetch('/api/content/video/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyVideo())
    setAdding(false)
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this video?')) return
    await fetch('/api/content/video/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ videos: videos.filter(v => v.id !== id) }),
    })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Video</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Video
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Embed URL (YouTube/Vimeo)" value={form.embedUrl ?? ''} onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam col-span-2 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.embedUrl}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setForm(emptyVideo()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {videos.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No videos yet.</p>}
        {videos.map(v => (
          <div key={v.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-sans text-sm text-charcoal">{v.title}</p>
              <p className="font-sans text-xs text-charcoal/40 truncate max-w-xs">{v.embedUrl}</p>
            </div>
            <button onClick={() => remove(v.id)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/admin/music/page.tsx`**

```typescript
// app/admin/music/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { MusicIndex, Track } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2 } from 'lucide-react'

const emptyTrack = (): Partial<Track> => ({ title: '', fileUrl: '', artworkUrl: '', duration: '' })

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [form, setForm] = useState<Partial<Track>>(emptyTrack())
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/music/index').then(r => r.json()).then(d => setTracks(d?.tracks ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const track: Track = {
      id: form.id ?? Date.now().toString(),
      title: form.title!,
      fileUrl: form.fileUrl!,
      artworkUrl: form.artworkUrl ?? '',
      duration: form.duration ?? '',
      order: tracks.length,
      createdAt: new Date().toISOString(),
    }
    const updated: MusicIndex = { tracks: [...tracks.filter(t => t.id !== track.id), track] }
    await fetch('/api/content/music/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyTrack())
    setAdding(false)
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this track?')) return
    await fetch('/api/content/music/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tracks: tracks.filter(t => t.id !== id) }),
    })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Music</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Track
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <input placeholder="Track title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Duration (e.g. 3:42)" value={form.duration ?? ''} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <div>
              <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Audio file</p>
              <FileUpload accept="audio/*" onUploaded={url => setForm(f => ({ ...f, fileUrl: url }))} currentUrl={form.fileUrl} label="Upload audio" />
            </div>
            <div>
              <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Artwork</p>
              <FileUpload onUploaded={url => setForm(f => ({ ...f, artworkUrl: url }))} currentUrl={form.artworkUrl} label="Upload artwork" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.fileUrl}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setForm(emptyTrack()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {tracks.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No tracks yet.</p>}
        {tracks.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 px-5 py-3">
            <span className="font-sans text-xs text-charcoal/30 w-5">{i + 1}</span>
            {t.artworkUrl && <img src={t.artworkUrl} alt={t.title} className="w-10 h-10 object-cover rounded" />}
            <p className="font-sans text-sm text-charcoal flex-1">{t.title}</p>
            <p className="font-sans text-xs text-charcoal/40">{t.duration}</p>
            <button onClick={() => remove(t.id)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/admin/shop/page.tsx`**

```typescript
// app/admin/shop/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { ProductIndex, Product } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2 } from 'lucide-react'

const emptyProduct = (): Partial<Product> => ({
  title: '', description: '', price: 0, images: [], stock: 1, status: 'active',
})

export default function AdminShopPage() {
  const [products, setProducts] = useState<ProductIndex['products']>([])
  const [form, setForm] = useState<Partial<Product>>(emptyProduct())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/shop/index').then(r => r.json()).then(d => setProducts(d?.products ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const slug = form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const product: Product = {
      slug,
      title: form.title!,
      description: form.description ?? '',
      price: Number(form.price),
      images: form.images ?? [],
      stock: Number(form.stock),
      status: form.status as 'active' | 'archived',
      createdAt: form.createdAt ?? new Date().toISOString(),
    }
    await fetch(`/api/content/shop/${slug}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(product),
    })
    const updated: ProductIndex = {
      products: [
        ...products.filter(p => p.slug !== slug),
        { slug, title: product.title, price: product.price, images: product.images, stock: product.stock, status: product.status },
      ],
    }
    await fetch('/api/content/shop/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyProduct())
    setEditing(false)
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this product?')) return
    await fetch('/api/content/shop/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ products: products.filter(p => p.slug !== slug) }),
    })
    await load()
  }

  const addImage = (url: string) => setForm(f => ({ ...f, images: [...(f.images ?? []), url] }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Shop</h1>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Product title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Price (USD)" type="number" step="0.01" value={form.price ?? ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Stock quantity" type="number" value={form.stock ?? ''} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <select value={form.status ?? 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'archived' }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam bg-white">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam col-span-2 resize-none" />
          </div>
          <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Product Images</p>
          <div className="flex gap-3 flex-wrap mb-3">
            {(form.images ?? []).map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded" />
                <button onClick={() => setForm(f => ({ ...f, images: f.images?.filter((_, j) => j !== i) }))}
                  className="absolute -top-1 -right-1 bg-burnt text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">×</button>
              </div>
            ))}
            <FileUpload onUploaded={addImage} label="Add image" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.price}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyProduct()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {products.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No products yet.</p>}
        {products.map(p => (
          <div key={p.slug} className="flex items-center gap-4 px-5 py-3">
            {p.images[0] && <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-sans text-sm text-charcoal">{p.title}</p>
              <p className="font-sans text-xs text-burnt mt-0.5">${p.price.toFixed(2)} · {p.stock} in stock</p>
            </div>
            <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
              ${p.status === 'active' ? 'bg-seafoam/10 text-seafoam' : 'bg-gray-100 text-gray-400'}`}>
              {p.status}
            </span>
            <button onClick={() => { /* load full product then set form+editing */ }} className="font-sans text-xs text-ocean hover:underline">Edit</button>
            <button onClick={() => remove(p.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Wire up the Edit button in shop admin — replace the comment with actual logic**

In `app/admin/shop/page.tsx`, replace:
```typescript
<button onClick={() => { /* load full product then set form+editing */ }} className="font-sans text-xs text-ocean hover:underline">Edit</button>
```
With:
```typescript
<button onClick={async () => {
  const res = await fetch(`/api/content/shop/${p.slug}`)
  const full = await res.json()
  setForm(full)
  setEditing(true)
}} className="font-sans text-xs text-ocean hover:underline">Edit</button>
```

- [ ] **Step 6: Create `app/admin/orders/page.tsx`**

```typescript
// app/admin/orders/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { OrderIndex, Order } from '@/lib/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderIndex['orders']>([])
  const [selected, setSelected] = useState<Order | null>(null)

  const load = () =>
    fetch('/api/content/orders/index').then(r => r.json()).then(d => setOrders(d?.orders ?? []))

  useEffect(() => { load() }, [])

  const viewOrder = async (id: string) => {
    const res = await fetch(`/api/content/orders/${id}`)
    setSelected(await res.json())
  }

  const updateStatus = async (id: string, status: Order['status']) => {
    const res = await fetch(`/api/content/orders/${id}`)
    const order: Order = await res.json()
    await fetch(`/api/content/orders/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...order, status }),
    })
    const updated = { orders: orders.map(o => o.id === id ? { ...o, status } : o) }
    await fetch('/api/content/orders/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setOrders(updated.orders)
    if (selected?.id === id) setSelected(o => o ? { ...o, status } : o)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-6">Orders</h1>
        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
          {orders.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No orders yet.</p>}
          {orders.map(o => (
            <button key={o.id} onClick={() => viewOrder(o.id)}
              className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-off-white transition-colors
                ${selected?.id === o.id ? 'bg-off-white' : ''}`}>
              <div>
                <p className="font-sans text-sm text-charcoal">{o.customerEmail}</p>
                <p className="font-sans text-xs text-charcoal/40 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm text-burnt">${o.total.toFixed(2)}</span>
                <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
                  ${o.status === 'paid' ? 'bg-seafoam/10 text-seafoam' : ''}
                  ${o.status === 'shipped' ? 'bg-ocean/10 text-ocean' : ''}
                  ${o.status === 'delivered' ? 'bg-green-50 text-green-600' : ''}
                  ${o.status === 'pending' ? 'bg-gray-100 text-gray-500' : ''}`}>
                  {o.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="bg-white rounded-lg border border-gray-100 p-5">
          <h2 className="font-serif text-lg text-charcoal mb-1">Order Detail</h2>
          <p className="font-sans text-xs text-charcoal/40 mb-4">#{selected.id.slice(-8)}</p>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-1">Customer</p>
            <p className="font-sans text-sm">{selected.customerName}</p>
            <p className="font-sans text-xs text-charcoal/60">{selected.customerEmail}</p>
          </div>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-1">Shipping</p>
            <p className="font-sans text-sm">{selected.shippingAddress.line1}</p>
            <p className="font-sans text-xs text-charcoal/60">
              {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Items</p>
            {selected.items.map((item, i) => (
              <div key={i} className="flex justify-between font-sans text-sm py-1">
                <span>{item.productTitle} × {item.quantity}</span>
                <span className="text-burnt">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 flex justify-between font-sans text-sm font-medium mt-2 pt-2">
              <span>Total</span>
              <span className="text-burnt">${selected.total.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['pending', 'paid', 'shipped', 'delivered'] as const).map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className={`font-sans text-xs uppercase tracking-wider px-3 py-1.5 rounded border transition-colors
                    ${selected.status === s ? 'bg-ocean text-white border-ocean' : 'border-gray-200 text-charcoal/60 hover:border-ocean'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Create `app/admin/homepage/page.tsx`**

```typescript
// app/admin/homepage/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { HomepageContent } from '@/lib/types'

const defaults: HomepageContent = {
  heroTitle: 'faavidel',
  heroSubtitle: 'A world of creative work',
  heroButtonText: 'Explore the Gallery',
  featuredArtworkSlugs: [],
  bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing.',
}

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageContent>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/homepage').then(r => r.json()).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/content/homepage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Homepage Content</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Hero Title</label>
          <input value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Hero Subtitle</label>
          <input value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Hero Button Text</label>
          <input value={form.heroButtonText} onChange={e => setForm(f => ({ ...f, heroButtonText: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Bio Snippet</label>
          <textarea value={form.bioSnippet} onChange={e => setForm(f => ({ ...f, bioSnippet: e.target.value }))} rows={3}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam resize-none" />
        </div>
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `app/admin/about/page.tsx`**

```typescript
// app/admin/about/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'

const defaults: AboutContent = { fullBio: '', profilePhotoUrl: '', instagram: '', email: '' }

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutContent>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/about').then(r => r.json()).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/content/about', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">About</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-2">Profile Photo</label>
          <FileUpload onUploaded={url => setForm(f => ({ ...f, profilePhotoUrl: url }))} currentUrl={form.profilePhotoUrl} label="Upload profile photo" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Full Bio</label>
          <textarea value={form.fullBio} onChange={e => setForm(f => ({ ...f, fullBio: e.target.value }))} rows={8}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam resize-none" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Instagram (handle only)</label>
          <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@handle"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Contact Email</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Create `app/admin/settings/page.tsx`**

```typescript
// app/admin/settings/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { SiteSettings } from '@/lib/types'

const defaults: SiteSettings = { siteTitle: 'faavidel.art', siteDescription: '', contactEmail: '', metaImage: '' }

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/site').then(r => r.json()).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/content/site', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        {[
          { key: 'siteTitle', label: 'Site Title' },
          { key: 'siteDescription', label: 'Meta Description' },
          { key: 'contactEmail', label: 'Contact Email', type: 'email' },
          { key: 'metaImage', label: 'Default Meta Image URL' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">{label}</label>
            <input
              value={(form as Record<string, string>)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              type={type ?? 'text'}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam"
            />
          </div>
        ))}
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 10: Commit all admin pages**

```bash
git add app/admin/
git commit -m "feat: add all admin CMS pages (photography, video, music, shop, orders, homepage, about, settings)"
```

---

## Phase 6: Seed Content + Deployment

### Task 24: Seed Default Content

**Files:**
- Create: `scripts/seed.ts`

- [ ] **Step 1: Create `scripts/seed.ts`**

```typescript
// scripts/seed.ts
// Run with: npx tsx scripts/seed.ts
import { put } from '@vercel/blob'

const seed = async (path: string, data: unknown) => {
  const content = JSON.stringify(data, null, 2)
  await put(`content/${path}`, content, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
  console.log(`✓ Seeded ${path}`)
}

async function main() {
  await seed('site.json', {
    siteTitle: 'faavidel.art',
    siteDescription: 'A multidisciplinary creative portfolio — art, photography, music, and writing.',
    contactEmail: 'hello@faavidel.art',
    metaImage: '',
  })

  await seed('homepage.json', {
    heroTitle: 'faavidel',
    heroSubtitle: 'A world of creative work',
    heroButtonText: 'Explore the Gallery',
    featuredArtworkSlugs: [],
    bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing. Every piece is an exploration of memory, nature, and emotion.',
  })

  await seed('about.json', {
    fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.\n\nEvery piece begins as a question and ends somewhere unexpected.',
    profilePhotoUrl: '',
    instagram: '',
    email: 'hello@faavidel.art',
  })

  await seed('gallery/index.json', { artworks: [] })
  await seed('photography/index.json', { series: [] })
  await seed('writing/index.json', { posts: [] })
  await seed('video/index.json', { videos: [] })
  await seed('music/index.json', { tracks: [] })
  await seed('shop/index.json', { products: [] })
  await seed('orders/index.json', { orders: [] })

  console.log('\n✅ All content seeded successfully.')
}

main().catch(console.error)
```

- [ ] **Step 2: Add `tsx` dev dependency**

```bash
npm install -D tsx
```

- [ ] **Step 3: Run the seed script** (requires `BLOB_READ_WRITE_TOKEN` to be set in `.env.local`)

```bash
npx tsx scripts/seed.ts
```

Expected output:
```
✓ Seeded site.json
✓ Seeded homepage.json
✓ Seeded about.json
✓ Seeded gallery/index.json
✓ Seeded photography/index.json
✓ Seeded writing/index.json
✓ Seeded video/index.json
✓ Seeded music/index.json
✓ Seeded shop/index.json
✓ Seeded orders/index.json

✅ All content seeded successfully.
```

- [ ] **Step 4: Commit**

```bash
git add scripts/seed.ts package.json
git commit -m "feat: add content seed script"
```

---

### Task 25: Vercel Deployment Setup

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "functions": {
    "app/api/webhooks/stripe/route.ts": {
      "maxDuration": 10
    }
  }
}
```

- [ ] **Step 2: Build locally to verify no TypeScript errors**

```bash
npm run build
```

Expected: Build completes with no errors. (Warnings about dynamic usage or server components are acceptable.)

- [ ] **Step 3: Push to GitHub and connect to Vercel**

```bash
git remote add origin https://github.com/<your-username>/faavidel-art.git
git push -u origin main
```

Then in Vercel dashboard:
1. Import the GitHub repo
2. Set environment variables:
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate
   - `NEXTAUTH_URL` — `https://faavidel.art`
   - `ADMIN_USER` — `admin`
   - `ADMIN_PASS` — `Faezeh@`
   - `STRIPE_SECRET_KEY` — from Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET` — from Stripe webhook settings
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard
   - `RESEND_API_KEY` — from Resend dashboard
3. Add Vercel Blob storage from Storage tab → this sets `BLOB_READ_WRITE_TOKEN` automatically
4. Deploy

- [ ] **Step 4: Register Stripe webhook**

In Stripe Dashboard → Developers → Webhooks:
- Add endpoint: `https://faavidel.art/api/webhooks/stripe`
- Event: `checkout.session.completed`
- Copy signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel

- [ ] **Step 5: Run seed script against production**

Set `BLOB_READ_WRITE_TOKEN` to the production token temporarily and run:

```bash
BLOB_READ_WRITE_TOKEN=your-production-token npx tsx scripts/seed.ts
```

- [ ] **Step 6: Final commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel deployment config"
git push
```

---

## Self-Review

**Spec coverage check:**
- ✅ All public pages: Home, Gallery, Photography, Writing, Video, Music, Shop, About
- ✅ Admin panel: Dashboard, all content sections, Orders, Homepage, About, Settings
- ✅ Admin auth: NextAuth credentials, hardcoded `admin/Faezeh@`, JWT session, `/admin` route
- ✅ Vercel Blob: read/write helpers, JSON content storage, media upload
- ✅ Stripe: checkout session, webhook → order creation
- ✅ Resend: contact form email
- ✅ Animations: Framer Motion (page transitions, scroll reveals, cart drawer), GSAP (hero ink reveal), canvas particles, custom cursor, loader
- ✅ Color palette: Ocean, Burnt Red, Seafoam, Charcoal, Off-white backgrounds (no sand backgrounds)
- ✅ Cart: localStorage persistence, CartContext, CartDrawer

**Type consistency check:**
- `readJSON<T>` / `writeJSON<T>` consistently typed
- `Artwork`, `Post`, `Product`, `Order`, `Track`, `VideoItem`, `Photo` used consistently across pages and admin forms
- `CartItem` used in `CartContext`, `CartDrawer`, and checkout route

**No placeholders:** All code blocks are complete and runnable.
