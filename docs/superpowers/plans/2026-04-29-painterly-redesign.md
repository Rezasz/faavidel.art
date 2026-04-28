# Painterly Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current visual layer of faavidel.art with a painterly redesign — Cormorant Garamond + IBM Plex Mono typography, watercolor-painting atmospheric layer (Ken-Burns crossfade + edge-bleed turbulence + animated brushstrokes + ringed orbs + vignette/grain), ambient piano background music, and seed the gallery with the 18 World Art Dubai 2026 paintings. Spec: `docs/superpowers/specs/2026-04-29-painterly-redesign-design.md`.

**Architecture:** A single shared `<AtmosphericLayer />` renders behind every public page, layered with painting Ken-Burns crossfade (turbulence-bled), self-painting SVG brushstrokes, ringed pulsing orbs, vignette, and grain. A new MusicContext owns a single `<audio>` element that survives navigation and is toggled by a floating bottom-right button. The current `ocean`/`seafoam`/`charcoal` palette and generic Tailwind fonts are replaced with brand tokens (`iris`, `indigo`, `lilac`, `coral`, `amber`, `rose`, `cream`, `night`, `parchment`) and `next/font` Cormorant + Plex Mono. Admin gets the same atmosphere at reduced intensity to stay productive.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v3 · `next/font/google` (Cormorant Garamond, IBM Plex Mono) · SVG `feTurbulence` + `feDisplacementMap` for edge-bleed and ink texture · CSS `@keyframes` for Ken-Burns + brushstroke draw + orb pulse · React Context + `localStorage` for music state.

**Testing strategy:** This redesign is largely presentational, and the project has no test framework installed. The skill normally prescribes TDD; we adapt: pure-logic modules (`MusicContext` state machine, painting cycler index math, slug derivation) get small standalone test scripts under `scripts/test-*.ts` runnable via `npx tsx`. Visual components are verified by `npm run dev` browser checks against a checklist baked into each task. `npm run build` and `npm run lint` must pass before each phase commit.

**Branch strategy:** All work on `main`. Each task ends with a commit so partial progress is recoverable. After Phase 3 the site should already feel transformed even before pages are migrated.

---

## File Structure

**New files:**

```
public/audio/ambient.mp3                              # already copied (234 KB)

context/
  MusicContext.tsx                                    # play/mute state + audio ref + localStorage

components/
  atmosphere/
    AtmosphericLayer.tsx                              # composite background — paintings, ink, orbs, vignette, grain
    BleedImage.tsx                                    # next/image wrapped with feTurbulence/feDisplacementMap
    RingedOrb.tsx                                     # core gradient + 2 ring auras + pulse
    PaintedUnderline.tsx                              # animated SVG underline curve
    PaintedDivider.tsx                                # horizontal painted hr
    BrushButton.tsx                                   # painted-stroke shaped CTA
    PaintedFrame.tsx                                  # 4-stroke rectangle border that draws in
  ui/
    BackgroundMusic.tsx                               # floating mute toggle

scripts/
  seed-paintings-wad.ts                               # uploads 18 WAD paintings to Vercel Blob, writes gallery.json
  test-music-context.ts                               # state machine sanity check
  test-painting-cycler.ts                             # cycler index math sanity check
```

**Modified files:**

```
tailwind.config.ts                                    # brand palette + font CSS vars
app/globals.css                                       # remove ocean/seafoam, add base styles for new tokens
next.config.ts                                        # add cloudfront hostname, drop picsum
app/layout.tsx                                        # next/font setup + MusicProvider + BackgroundMusic + AtmosphericLayer
app/admin/layout.tsx                                  # painterly admin shell (reduced intensity)
app/admin/page.tsx                                    # login page outside the admin shell
components/layout/Nav.tsx
components/layout/Footer.tsx
components/layout/PageTransition.tsx
components/ui/CustomCursor.tsx
components/ui/Loader.tsx
components/admin/AdminNav.tsx                         # Cormorant brand, Plex Mono nav, amber active

# every public page (palette + type rewrites + AtmosphericLayer integration)
app/page.tsx
app/gallery/page.tsx
app/gallery/[slug]/page.tsx
app/photography/page.tsx
app/photography/[series]/page.tsx
app/writing/page.tsx
app/writing/[slug]/page.tsx
app/video/page.tsx
app/music/page.tsx
app/shop/page.tsx
app/shop/[slug]/page.tsx
app/about/page.tsx

# every admin page (palette + type rewrites only — no atmosphere blocking)
app/admin/dashboard/page.tsx
app/admin/gallery/page.tsx
app/admin/photography/page.tsx
app/admin/writing/page.tsx
app/admin/video/page.tsx
app/admin/music/page.tsx
app/admin/shop/page.tsx
app/admin/orders/page.tsx
app/admin/homepage/page.tsx
app/admin/about/page.tsx
app/admin/settings/page.tsx
```

---

## Phase 1 — Foundation

### Task 1.1: Configure next/font and fonts CSS variables

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the imports + add font loaders**

Replace the top of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import Loader from '@/components/ui/Loader'
import PageTransition from '@/components/layout/PageTransition'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'faavidel — paintings, photography, writing, music',
  description: 'Multidisciplinary work by Faezeh Ghavidel — paintings, photography, writing, video and music.',
}
```

- [ ] **Step 2: Apply the font variables to the html element**

Replace the `RootLayout` JSX with:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plexMono.variable}`}>
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

(Music + AtmosphericLayer wiring comes in Task 3.8 after their files exist.)

- [ ] **Step 3: Verify dev server compiles**

Run: `npm run dev`
Expected: dev server starts, no font-related errors. Browser may render with system fallback until fonts are wired into Tailwind in Task 1.2.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "chore: load Cormorant Garamond + IBM Plex Mono via next/font"
```

---

### Task 1.2: Replace Tailwind palette and fonts with brand tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Rewrite the file**

Overwrite `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          iris:      '#6B5BA8',
          indigo:    '#3B4FB0',
          lilac:     '#9D7EC8',
          coral:     '#E89B7C',
          amber:     '#E8B86F',
          rose:      '#D86E78',
          cream:     '#FBE7D0',
          night:     '#0E0A1C',
          parchment: '#FBF7EE',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono:  ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest: '0.4em',
        wider:  '0.25em',
        wide:   '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Verify Tailwind picks up the tokens**

Run: `npm run dev` (already running — restart if needed)
Open http://localhost:3000 — page will look broken because existing `bg-ocean`, `text-charcoal`, etc. classes no longer resolve. That's expected and fixed in subsequent tasks.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(tailwind): replace ocean palette with brand tokens; wire next/font vars"
```

---

### Task 1.3: Update globals.css to use brand tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Overwrite globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    cursor: none;
  }
  body {
    @apply font-serif text-brand-night bg-brand-parchment antialiased;
  }
  ::selection {
    background: theme('colors.brand.amber');
    color: theme('colors.brand.night');
  }
}

@layer utilities {
  .section-label {
    @apply font-mono text-[11px] tracking-widest uppercase text-brand-amber/80;
  }
  .section-title {
    @apply text-3xl text-brand-cream font-serif italic;
  }
  .section-title-dark {
    @apply text-3xl text-brand-night font-serif italic;
  }
  .painted-rule {
    @apply w-12 h-px bg-brand-amber/60 mt-2 mb-7;
  }
}
```

- [ ] **Step 2: Verify the body now renders parchment-cream**

Reload http://localhost:3000 — background should be `#FBF7EE`. Existing pages will still have broken styling for the foreground; that's fine.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(css): brand-token base styles + painted utility classes"
```

---

### Task 1.4: Update next.config.ts image hostnames

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Overwrite the file**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'd1l8km4g5s76x5.cloudfront.net' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Restart dev server (next.config requires restart)**

Stop dev server (Ctrl-C) and run `npm run dev` again.
Expected: clean restart, no errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore(next): allow CloudFront hostname for WAD painting URLs"
```

---

## Phase 2 — Atmosphere primitives

### Task 2.1: BleedImage component

**Files:**
- Create: `components/atmosphere/BleedImage.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import Image from 'next/image'
import { useId } from 'react'

interface BleedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  scale?: number          // displacement strength (default 14)
  sizes?: string
}

export default function BleedImage({
  src, alt, width, height, fill, className = '', priority, scale = 14, sizes,
}: BleedImageProps) {
  const id = useId().replace(/[:]/g, '-')
  const filterId = `bleed-${id}`

  return (
    <div className={`relative ${className}`} style={{ filter: `url(#${filterId})` }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={3} result="t">
              <animate attributeName="baseFrequency" dur="28s" values="0.012;0.018;0.012" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="t" scale={scale}/>
          </filter>
        </defs>
      </svg>
      {fill ? (
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes ?? '100vw'} className="object-cover" />
      ) : (
        <Image src={src} alt={alt} width={width!} height={height!} priority={priority} className="w-full h-auto" />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify it renders by importing on the home page temporarily**

Open `app/page.tsx`, add this at the top of the JSX as a smoke test:

```tsx
import BleedImage from '@/components/atmosphere/BleedImage'
// ... in the JSX:
<div className="w-full h-screen relative">
  <BleedImage fill src="https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770967843.jpg" alt="" priority />
</div>
```

Reload http://localhost:3000 — the painting should fill the screen with bleeding, animated edges. Remove the smoke-test code afterwards (it'll be properly added in Task 2.7).

- [ ] **Step 3: Commit**

```bash
git add components/atmosphere/BleedImage.tsx
git commit -m "feat(atmosphere): BleedImage with animated turbulence/displacement edges"
```

---

### Task 2.2: RingedOrb component

**Files:**
- Create: `components/atmosphere/RingedOrb.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'

interface RingedOrbProps {
  size?: number          // px
  className?: string     // for absolute positioning
  delay?: number         // animation delay seconds
  rings?: 'both' | 'solid' | 'dashed' | 'none'
}

export default function RingedOrb({
  size = 56, className = '', delay = 0, rings = 'both',
}: RingedOrbProps) {
  const style: React.CSSProperties = {
    width: size, height: size,
    animation: `orb-pulse 5s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  }
  return (
    <div
      className={`pointer-events-none rounded-full ${className}`}
      style={{
        ...style,
        background: 'radial-gradient(circle, #FFE5A8 0%, #E8B86F 30%, rgba(232,184,111,0.45) 55%, transparent 80%)',
        boxShadow: '0 0 50px rgba(232,184,111,0.6)',
      }}
    >
      {(rings === 'both' || rings === 'solid') && (
        <span
          aria-hidden
          className="absolute inset-[-38%] rounded-full border border-brand-cream/60"
          style={{ animation: 'orb-spin 12s linear infinite' }}
        />
      )}
      {(rings === 'both' || rings === 'dashed') && (
        <span
          aria-hidden
          className="absolute inset-[-65%] rounded-full"
          style={{
            border: '1px dashed rgba(255,229,168,0.35)',
            animation: 'orb-spin 18s linear infinite reverse',
          }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add the keyframes to globals.css**

Append to `app/globals.css` inside the `@layer base` block (or after it):

```css
@keyframes orb-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}
@keyframes orb-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  [class*="orb-"] { animation: none !important; }
}
```

- [ ] **Step 3: Verify rendering**

Drop `<RingedOrb size={64} className="absolute top-1/2 left-1/2" />` on the home page temporarily and confirm a pulsing amber orb with rotating ring auras. Remove afterwards.

- [ ] **Step 4: Commit**

```bash
git add components/atmosphere/RingedOrb.tsx app/globals.css
git commit -m "feat(atmosphere): RingedOrb + global keyframes (pulse, spin)"
```

---

### Task 2.3: PaintedUnderline component

**Files:**
- Create: `components/atmosphere/PaintedUnderline.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'

interface PaintedUnderlineProps {
  width?: number       // final draw width in px
  color?: string
  className?: string
  delay?: number       // sec
}

export default function PaintedUnderline({
  width = 240, color = '#E8B86F', className = '', delay = 0.6,
}: PaintedUnderlineProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        width: 0,
        height: 14,
        animation: `painted-underline-draw 4s ease-out ${delay}s forwards`,
        ['--underline-final' as never]: `${width}px`,
      }}
    >
      <svg width={width} height={14} viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden>
        <path d="M2 8 Q 60 2 120 7 T 238 9" stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Add keyframe + reduced motion to globals.css**

Append:

```css
@keyframes painted-underline-draw {
  to { width: var(--underline-final); }
}
@media (prefers-reduced-motion: reduce) {
  [style*="painted-underline-draw"] {
    animation: none !important;
    width: var(--underline-final) !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/atmosphere/PaintedUnderline.tsx app/globals.css
git commit -m "feat(atmosphere): PaintedUnderline with draw-in animation"
```

---

### Task 2.4: PaintedDivider component

**Files:**
- Create: `components/atmosphere/PaintedDivider.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import { useId } from 'react'

interface PaintedDividerProps {
  className?: string
  color?: string
  width?: string         // CSS width, default 'min(420px, 80%)'
}

export default function PaintedDivider({
  className = '', color = '#E8B86F', width = 'min(420px, 80%)',
}: PaintedDividerProps) {
  const rawId = useId().replace(/[:]/g, '-')
  const filterId = `pd-${rawId}`
  return (
    <div className={`my-12 flex justify-center ${className}`} style={{ width: '100%' }}>
      <svg
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        aria-hidden
        style={{ width, height: 16 }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={5}/>
            <feDisplacementMap in="SourceGraphic" scale={1.6}/>
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path d="M5 9 Q 100 4 200 8 T 395 10" stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.9}/>
          <path d="M30 12 Q 130 9 230 11 T 380 12" stroke={color} strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.5}/>
        </g>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/atmosphere/PaintedDivider.tsx
git commit -m "feat(atmosphere): PaintedDivider as ink-line section break"
```

---

### Task 2.5: BrushButton component

**Files:**
- Create: `components/atmosphere/BrushButton.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import Link from 'next/link'
import { useId } from 'react'

interface BrushButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'amber' | 'cream'
  className?: string
  disabled?: boolean
}

export default function BrushButton({
  children, href, onClick, type = 'button', variant = 'amber', className = '', disabled,
}: BrushButtonProps) {
  const rawId = useId().replace(/[:]/g, '-')
  const filterId = `bb-${rawId}`
  const colors = variant === 'amber'
    ? 'text-brand-night hover:text-brand-night/85'
    : 'text-brand-night hover:text-brand-night/85'
  const fill = variant === 'amber' ? '#E8B86F' : '#FBE7D0'
  const base = `relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest px-8 py-3 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${colors} ${className}`

  const content = (
    <>
      <svg
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={9}/>
            <feDisplacementMap in="SourceGraphic" scale={2}/>
          </filter>
        </defs>
        <path
          d="M4 6 Q 50 1 100 4 T 196 7 L 196 33 Q 150 38 100 35 T 4 33 Z"
          fill={fill}
          filter={`url(#${filterId})`}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return <Link href={href} className={base}>{content}</Link>
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {content}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/atmosphere/BrushButton.tsx
git commit -m "feat(atmosphere): BrushButton CTA with painted-stroke shape"
```

---

### Task 2.6: PaintedFrame component

**Files:**
- Create: `components/atmosphere/PaintedFrame.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import { useId } from 'react'

interface PaintedFrameProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export default function PaintedFrame({ children, className = '', color = '#FBE7D0' }: PaintedFrameProps) {
  const rawId = useId().replace(/[:]/g, '-')
  const filterId = `pf-${rawId}`
  return (
    <div className={`relative ${className}`}>
      {children}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={7}/>
            <feDisplacementMap in="SourceGraphic" scale={1.4}/>
          </filter>
        </defs>
        <g
          stroke={color}
          strokeWidth={0.6}
          fill="none"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'frame-draw 1.6s ease-out forwards' }}
        >
          <path d="M2 2 L 98 3"/>
          <path d="M98 2 L 97 98" style={{ animationDelay: '.4s' }}/>
          <path d="M98 98 L 2 97" style={{ animationDelay: '.8s' }}/>
          <path d="M2 98 L 3 2" style={{ animationDelay: '1.2s' }}/>
        </g>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Add keyframe to globals.css**

Append:

```css
@keyframes frame-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  [style*="frame-draw"] { animation: none !important; stroke-dashoffset: 0 !important; }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/atmosphere/PaintedFrame.tsx app/globals.css
git commit -m "feat(atmosphere): PaintedFrame border that draws in"
```

---

### Task 2.7: AtmosphericLayer (the centerpiece)

**Files:**
- Create: `components/atmosphere/AtmosphericLayer.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import Image from 'next/image'
import RingedOrb from './RingedOrb'

const DEFAULT_PAINTINGS = [
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770967843.jpg',
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770985530.jpg',
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1762981010.jpg',
]

interface AtmosphericLayerProps {
  paintings?: string[]          // 1-N painting urls; cycles in order
  darken?: number               // 0..1, default 0.55
  showOrbs?: boolean            // default true
  showStrokes?: boolean         // default true
  className?: string
}

export default function AtmosphericLayer({
  paintings = DEFAULT_PAINTINGS,
  darken = 0.55,
  showOrbs = true,
  showStrokes = true,
  className = '',
}: AtmosphericLayerProps) {
  const slots = paintings.slice(0, 3)
  const cycleSeconds = slots.length * 10

  return (
    <div aria-hidden className={`fixed inset-0 -z-10 overflow-hidden bg-brand-night ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="atm-bleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={3} result="t">
              <animate attributeName="baseFrequency" dur="28s" values="0.012;0.018;0.012" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="t" scale={14}/>
          </filter>
          <filter id="atm-ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={2} seed={5}/>
            <feDisplacementMap in="SourceGraphic" scale={2}/>
          </filter>
        </defs>
      </svg>

      {/* painting layers */}
      {slots.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 opacity-0"
          style={{
            filter: 'url(#atm-bleed)',
            animation: `atm-cycle ${cycleSeconds}s ease-in-out infinite`,
            animationDelay: `${-i * (cycleSeconds / slots.length)}s`,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 35%, rgba(14,10,28,${darken * 0.95}) 95%),
            linear-gradient(180deg, rgba(14,10,28,${darken * 0.45}) 0%, transparent 30%, transparent 65%, rgba(14,10,28,${darken * 0.65}) 100%)
          `,
        }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.16,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />

      {/* painted brushstrokes */}
      {showStrokes && (
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <g filter="url(#atm-ink)" opacity={0.85}>
            {[
              { d: 'M-50 180 Q 250 80 600 200 T 1200 220 T 1700 180', s: '#FBE7D0', w: 2,  delay:  0   },
              { d: 'M-50 250 Q 300 140 700 270 T 1700 250',          s: '#E8B86F', w: 3,  delay: -1.6 },
              { d: 'M-50 720 Q 350 640 750 700 T 1300 720 T 1700 700', s: '#FBE7D0', w: 2.5, delay: -3.2 },
              { d: 'M50 800 Q 400 740 800 790 T 1700 770',           s: '#D86E78', w: 2,  delay: -4.8 },
              { d: 'M-50 460 Q 220 420 400 460 T 800 470',           s: '#FBE7D0', w: 1.5, delay: -6.4 },
            ].map((b, i) => (
              <path
                key={i}
                d={b.d}
                stroke={b.s}
                strokeWidth={b.w}
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: 1400,
                  animation: 'atm-paint-on 8s ease-out infinite',
                  animationDelay: `${b.delay}s`,
                  opacity: i === 4 ? 0.55 : 0.85,
                }}
              />
            ))}
          </g>
        </svg>
      )}

      {/* orbs */}
      {showOrbs && (
        <>
          <RingedOrb size={64} className="absolute top-[18%] left-[78%]" />
          <RingedOrb size={36} className="absolute top-[52%] left-[8%]" delay={-2} rings="solid" />
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Append keyframes to globals.css**

```css
@keyframes atm-cycle {
  0%   { opacity: 0; transform: scale(1.05); }
  8%   { opacity: 1; }
  33%  { opacity: 1; transform: scale(1.18) translate(-2%, -1%); }
  41%  { opacity: 0; }
  100% { opacity: 0; transform: scale(1.18) translate(-2%, -1%); }
}
@keyframes atm-paint-on {
  0%   { stroke-dashoffset: 1400; opacity: 0; }
  8%   { opacity: 0.85; }
  65%  { stroke-dashoffset: 0;    opacity: 0.85; }
  90%  { stroke-dashoffset: 0;    opacity: 0; }
  100% { stroke-dashoffset: 0;    opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  [style*="atm-cycle"]    { animation: none !important; opacity: 1 !important; transform: none !important; }
  [style*="atm-paint-on"] { animation: none !important; stroke-dashoffset: 0 !important; opacity: 0.85 !important; }
}
```

- [ ] **Step 3: Smoke test on the home page**

Edit `app/page.tsx` — at the very top of the returned JSX, add:

```tsx
import AtmosphericLayer from '@/components/atmosphere/AtmosphericLayer'
// ...
return (
  <>
    <AtmosphericLayer />
    {/* ... existing home content ... */}
  </>
)
```

Reload http://localhost:3000. Confirm: paintings crossfade, edges bleed, brushstrokes paint themselves, two orbs pulse. Existing home content remains in place above the atmosphere — looks broken, that's fine.

Leave the `<AtmosphericLayer />` in place; subsequent home rewrite (Task 4.1) keeps it.

- [ ] **Step 4: Commit**

```bash
git add components/atmosphere/AtmosphericLayer.tsx app/globals.css app/page.tsx
git commit -m "feat(atmosphere): AtmosphericLayer composite (paintings + bleed + ink + orbs)"
```

---

## Phase 3 — Layout shell, music, cursor, loader

### Task 3.1: MusicContext

**Files:**
- Create: `context/MusicContext.tsx`
- Create: `scripts/test-music-context.ts`

- [ ] **Step 1: Write the failing logic test**

```ts
// scripts/test-music-context.ts
import assert from 'node:assert/strict'
import { reduceMusicState, initialMusicState } from '../context/MusicContext'

const s0 = initialMusicState()
assert.equal(s0.playing, false)

const s1 = reduceMusicState(s0, { type: 'play' })
assert.equal(s1.playing, true)

const s2 = reduceMusicState(s1, { type: 'pause' })
assert.equal(s2.playing, false)

const s3 = reduceMusicState(s2, { type: 'toggle' })
assert.equal(s3.playing, true)

const s4 = reduceMusicState(s3, { type: 'hydrate', playing: false })
assert.equal(s4.playing, false)

console.log('✓ music state reducer ok')
```

Run: `npx tsx scripts/test-music-context.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 2: Implement MusicContext**

```tsx
// context/MusicContext.tsx
'use client'
import { createContext, useContext, useEffect, useReducer, useRef, useCallback, ReactNode } from 'react'

type State = { playing: boolean }
type Action =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  | { type: 'hydrate'; playing: boolean }

export const initialMusicState = (): State => ({ playing: false })

export function reduceMusicState(s: State, a: Action): State {
  switch (a.type) {
    case 'play':    return { playing: true }
    case 'pause':   return { playing: false }
    case 'toggle':  return { playing: !s.playing }
    case 'hydrate': return { playing: a.playing }
  }
}

interface MusicContextValue {
  playing: boolean
  toggle: () => void
  pauseExternal: () => void   // used by /music page
  resumeExternal: () => void
}

const Ctx = createContext<MusicContextValue | null>(null)
const STORAGE_KEY = 'faavidel.music'
const VOLUME = 0.35
const FADE_MS = 800

export function MusicProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceMusicState, undefined, initialMusicState)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const externalPaused = useRef(false)

  // hydrate from localStorage
  useEffect(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (v === 'on') dispatch({ type: 'hydrate', playing: true })
  }, [])

  // persist
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, state.playing ? 'on' : 'off')
  }, [state.playing])

  // mount audio element once
  useEffect(() => {
    const a = new Audio('/audio/ambient.mp3')
    a.loop = true
    a.preload = 'auto'
    a.volume = 0
    audioRef.current = a
    return () => { a.pause(); a.src = '' }
  }, [])

  // play/pause + fade
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    let raf = 0, start = 0
    const target = state.playing && !externalPaused.current ? VOLUME : 0
    const from = a.volume
    const animate = (t: number) => {
      if (!start) start = t
      const k = Math.min(1, (t - start) / FADE_MS)
      a.volume = from + (target - from) * k
      if (k < 1) raf = requestAnimationFrame(animate)
      else if (target === 0) a.pause()
    }
    if (target > 0 && a.paused) {
      a.play().catch(() => {/* autoplay blocked — keep state, user must retry */})
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [state.playing])

  const toggle = useCallback(() => dispatch({ type: 'toggle' }), [])
  const pauseExternal = useCallback(() => {
    externalPaused.current = true
    audioRef.current?.pause()
  }, [])
  const resumeExternal = useCallback(() => {
    externalPaused.current = false
    if (state.playing) audioRef.current?.play().catch(() => {})
  }, [state.playing])

  return (
    <Ctx.Provider value={{ playing: state.playing, toggle, pauseExternal, resumeExternal }}>
      {children}
    </Ctx.Provider>
  )
}

export function useMusic() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useMusic must be inside <MusicProvider>')
  return v
}
```

- [ ] **Step 3: Run the test**

Run: `npx tsx scripts/test-music-context.ts`
Expected: `✓ music state reducer ok`

- [ ] **Step 4: Commit**

```bash
git add context/MusicContext.tsx scripts/test-music-context.ts
git commit -m "feat(music): MusicContext with reducer + audio fade + localStorage"
```

---

### Task 3.2: BackgroundMusic toggle

**Files:**
- Create: `components/ui/BackgroundMusic.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'
import { useMusic } from '@/context/MusicContext'

export default function BackgroundMusic() {
  const { playing, toggle } = useMusic()
  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
      className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase rounded-full backdrop-blur transition-colors
        ${playing
          ? 'bg-brand-amber/90 text-brand-night hover:bg-brand-amber'
          : 'bg-brand-night/60 text-brand-cream/80 hover:bg-brand-night/80 border border-brand-cream/20'}
      `}
      style={{ minWidth: 44, minHeight: 44 }}
    >
      <span aria-hidden className="mr-1.5">♪</span>
      {playing ? 'Music' : 'Muted'}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/BackgroundMusic.tsx
git commit -m "feat(music): BackgroundMusic floating toggle"
```

---

### Task 3.3: Rewrite Nav

**Files:**
- Modify: `components/layout/Nav.tsx`

- [ ] **Step 1: Read the existing file**

```bash
cat components/layout/Nav.tsx
```

Note its current structure (links, branding, mobile menu). The rewrite preserves routes and mobile behavior; only typography/colors/spacing change.

- [ ] **Step 2: Apply the painterly treatment**

Replace the contents with (preserving any route names that exist in the current file — adapt this template to the actual link list):

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/gallery',     label: 'Paintings' },
  { href: '/photography', label: 'Photography' },
  { href: '/writing',     label: 'Writing' },
  { href: '/video',       label: 'Video' },
  { href: '/music',       label: 'Music' },
  { href: '/shop',        label: 'Shop' },
  { href: '/about',       label: 'About' },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  if (path.startsWith('/admin')) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-9 py-5 flex items-center gap-7 text-brand-cream">
      <Link href="/" className="font-serif italic text-2xl tracking-wide hover:text-brand-amber transition-colors">faavidel</Link>
      <div className="hidden md:flex items-center gap-7 ml-auto">
        {links.map(l => {
          const active = path.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] tracking-widest uppercase transition-colors
                ${active ? 'text-brand-amber' : 'text-brand-cream/70 hover:text-brand-cream'}`}
            >
              {active && <span aria-hidden className="text-brand-amber mr-1">·</span>}
              {l.label}
            </Link>
          )
        })}
      </div>
      <button
        className="md:hidden ml-auto font-mono text-[11px] tracking-widest uppercase text-brand-cream/80"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-brand-night/95 backdrop-blur md:hidden flex flex-col py-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-[12px] tracking-widest uppercase text-brand-cream/80 px-6 py-3"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
```

If existing nav had additional behavior (search, cart link), copy those bits in following the same styling.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Nav.tsx
git commit -m "feat(nav): painterly Nav — Cormorant brand + Plex Mono links + amber active"
```

---

### Task 3.4: Rewrite Footer

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Apply the new style**

Replace contents:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export default function Footer() {
  const path = usePathname()
  if (path.startsWith('/admin')) return null

  return (
    <footer className="relative z-10 px-6 md:px-12 pt-4 pb-10 text-brand-cream/70">
      <PaintedDivider />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-serif italic text-lg text-brand-cream">faavidel</p>
        <div className="flex gap-6 font-mono text-[10px] tracking-widest uppercase">
          <Link href="https://www.instagram.com/faa.videl" target="_blank">Instagram</Link>
          <Link href="https://wa.me/971555895441" target="_blank">WhatsApp</Link>
          <Link href="https://linktr.ee/faavidel" target="_blank">Linktree</Link>
          <Link href="mailto:info@faavidel.art">Email</Link>
        </div>
        <p className="font-mono text-[10px] tracking-widest uppercase opacity-60">© Faezeh Ghavidel</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(footer): painted divider + Plex Mono social links"
```

---

### Task 3.5: Rewrite PageTransition

**Files:**
- Modify: `components/layout/PageTransition.tsx`

- [ ] **Step 1: Inspect the current implementation**

```bash
cat components/layout/PageTransition.tsx
```

- [ ] **Step 2: Replace contents**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.18 : 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

(The full painted-wipe transition described in the spec is implemented by the per-page `<AtmosphericLayer />` already crossfading between paintings; the route-level transition stays simple to avoid double-animation.)

- [ ] **Step 3: Commit**

```bash
git add components/layout/PageTransition.tsx
git commit -m "feat(transition): minimal opacity transition; atmosphere handles the painted feel"
```

---

### Task 3.6: Rewrite CustomCursor

**Files:**
- Modify: `components/ui/CustomCursor.tsx`

- [ ] **Step 1: Replace contents**

```tsx
'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const c = canvasRef.current!
    const d = dotRef.current!
    const ctx = c.getContext('2d')!
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      c.style.width = window.innerWidth + 'px'
      c.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const trail: { x: number; y: number; t: number }[] = []
    let mx = 0, my = 0, hovering = false
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      trail.push({ x: mx, y: my, t: performance.now() })
      if (trail.length > 30) trail.shift()
      const t = e.target as HTMLElement | null
      hovering = !!t?.closest('a, button')
    }
    window.addEventListener('mousemove', move)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr)
      const now = performance.now()
      ctx.lineCap = 'round'
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i]
        const age = (now - b.t) / 800
        if (age >= 1) continue
        ctx.strokeStyle = `rgba(232,184,111,${0.55 * (1 - age)})`
        ctx.lineWidth = 2 * (1 - age) + 0.5
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      d.style.transform = `translate(${mx}px, ${my}px) scale(${hovering ? 2.4 : 1})`
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-brand-amber pointer-events-none z-[61] mix-blend-screen transition-transform duration-150"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/CustomCursor.tsx
git commit -m "feat(cursor): amber painted cursor with canvas trail; disabled on touch"
```

---

### Task 3.7: Rewrite Loader

**Files:**
- Modify: `components/ui/Loader.tsx`

- [ ] **Step 1: Replace contents**

```tsx
'use client'
import { useEffect, useState } from 'react'
import RingedOrb from '@/components/atmosphere/RingedOrb'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1600)
    return () => clearTimeout(t)
  }, [])
  if (hidden) return null
  return (
    <div className="fixed inset-0 z-[80] bg-brand-night flex flex-col items-center justify-center transition-opacity duration-500"
         style={{ opacity: hidden ? 0 : 1 }}>
      <div className="flex gap-12 mb-6">
        <RingedOrb size={36} rings="solid" delay={0} />
        <RingedOrb size={42} delay={-1} />
        <RingedOrb size={36} rings="dashed" delay={-2} />
      </div>
      <p className="font-serif italic text-brand-cream text-2xl">faavidel</p>
      <PaintedUnderline width={140} delay={0.2} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Loader.tsx
git commit -m "feat(loader): three orbs + italic mark + painted underline"
```

---

### Task 3.8: Wire Music + Atmosphere into root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `RootLayout` JSX to compose providers and global atmosphere**

Replace just the `RootLayout` function:

```tsx
import AtmosphericLayer from '@/components/atmosphere/AtmosphericLayer'
import { MusicProvider } from '@/context/MusicContext'
import BackgroundMusic from '@/components/ui/BackgroundMusic'

// ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plexMono.variable}`}>
      <body>
        <MusicProvider>
          <CartProvider>
            <Loader />
            <CustomCursor />
            <AtmosphericLayer />
            <Nav />
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
            <BackgroundMusic />
          </CartProvider>
        </MusicProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Remove the smoke-test `<AtmosphericLayer />` from `app/page.tsx`**

The atmosphere now comes from the root layout. Open `app/page.tsx` and delete the duplicated `<AtmosphericLayer />` you added in Task 2.7.

- [ ] **Step 3: Verify**

`npm run dev`. Open http://localhost:3000. Confirm:
- atmosphere visible behind every route you click into
- bottom-right music toggle present, says "Muted" by default
- click toggle → reads "Music", piano plays softly
- reload → toggle stays off (default), localStorage works after toggling once
- navigate to `/admin` (you'll see the atmosphere too — admin gets its own treatment in Phase 5; nav and footer are hidden because they short-circuit on `/admin`)

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat(layout): wire MusicProvider + AtmosphericLayer + BackgroundMusic globally"
```

---

## Phase 4 — Public pages

For every page in this phase, the workflow is the same:

1. Read the existing file (`cat app/<route>/page.tsx`)
2. Replace **only** styling and typography:
   - any `bg-ocean` → `bg-brand-night/40` or remove (atmosphere handles bg)
   - any `text-charcoal` → `text-brand-night` (parchment surfaces) or `text-brand-cream` (over atmosphere)
   - any `text-seafoam` → `text-brand-amber`
   - any `font-sans` → `font-mono` if it's a label/eyebrow/UI, otherwise `font-serif`
   - replace `<h1/h2 className="...">` with italic Cormorant: add `italic` class, increase size
   - convert hard `<hr>` and section dividers to `<PaintedDivider />`
   - convert plain CTAs to `<BrushButton>`
   - wrap painting/photo `<img>` or `<Image>` thumbnails in `<BleedImage>` where artistic, leave admin/utility images plain
3. Keep all data fetching, route params, and existing logic untouched
4. After each page: `npm run dev` → load route → verify visually → commit

### Task 4.1: Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read the file**

```bash
cat app/page.tsx
```

- [ ] **Step 2: Update the hero block to italic Cormorant + Plex Mono eyebrow + painted underline**

Apply this hero pattern, keeping the existing data fetch for `homepage` content:

```tsx
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'
import BrushButton from '@/components/atmosphere/BrushButton'
// ...
<section className="relative min-h-screen flex items-center px-6 md:px-16">
  <div className="relative z-10 max-w-3xl">
    <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/75 mb-4">
      Faezeh Ghavidel · Multidisciplinary artist
    </p>
    <h1 className="font-serif italic text-brand-cream text-4xl md:text-6xl leading-[1.05]">
      {homepage.heroTitle}
    </h1>
    <PaintedUnderline width={240} className="mt-6" />
    <p className="mt-8 font-serif text-brand-cream/85 text-lg max-w-xl">
      {homepage.heroSubtitle}
    </p>
    <BrushButton href="/gallery" className="mt-8">{homepage.heroButtonText || 'See the work'}</BrushButton>
  </div>
</section>
```

For the featured artworks rail and writing teaser sections, replace `<hr>` with `<PaintedDivider />`, restyle the section labels with `.section-label` utility, and keep card images wrapped in `<BleedImage fill ... />`.

- [ ] **Step 3: Verify**

Visit `/`. Confirm hero typography, painted underline, brushstroke CTA, painted dividers, atmosphere behind everything. Featured cards bleed.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(home): painterly hero — italic Cormorant + painted underline + brush CTA"
```

---

### Task 4.2: Gallery index

**Files:**
- Modify: `app/gallery/page.tsx`

- [ ] **Step 1: Update the grid card styling**

Apply this card pattern to the gallery loop (preserving the data shape from `lib/types.ts:GalleryIndex`):

```tsx
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'
// per artwork:
<Link href={`/gallery/${a.slug}`} className="group block">
  <div className="relative aspect-[4/5] overflow-hidden">
    <BleedImage fill src={a.imageUrl} alt={a.title} sizes="(max-width:768px) 50vw, 33vw" />
  </div>
  <div className="mt-3">
    <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">№ {String(idx+1).padStart(2,'0')} / {total}</p>
    <h3 className="font-serif italic text-xl text-brand-cream mt-1">{a.title}</h3>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <PaintedUnderline width={120} delay={0} />
    </div>
  </div>
</Link>
```

Tag filter chips: `font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-brand-cream/30 text-brand-cream/80 hover:bg-brand-amber hover:text-brand-night transition-colors`.

- [ ] **Step 2: Verify**

Visit `/gallery`. Cards bleed, hover shows painted underline, atmosphere behind the grid.

- [ ] **Step 3: Commit**

```bash
git add app/gallery/page.tsx
git commit -m "feat(gallery): painterly grid — bleed cards + Plex Mono numbering + hover underline"
```

---

### Task 4.3: Gallery detail

**Files:**
- Modify: `app/gallery/[slug]/page.tsx`

- [ ] **Step 1: Update layout**

```tsx
import BleedImage from '@/components/atmosphere/BleedImage'
import RingedOrb from '@/components/atmosphere/RingedOrb'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'
// ...
<article className="relative">
  <div className="relative w-full h-screen">
    <BleedImage fill src={art.imageUrl} alt={art.title} priority sizes="100vw" />
    <RingedOrb size={48} className="absolute top-[14%] right-[10%]" />
  </div>
  <section className="max-w-3xl mx-auto px-6 py-16 text-brand-cream">
    <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65">{art.year}</p>
    <h1 className="font-serif italic text-4xl md:text-5xl mt-3">{art.title}</h1>
    <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
    <p className="font-serif text-brand-cream/85 text-lg leading-relaxed">{art.description}</p>
    <div className="mt-6 flex gap-4 font-mono text-[10px] uppercase tracking-widest text-brand-cream/55">
      {art.tags.map(t => <span key={t}>#{t}</span>)}
    </div>
  </section>
</article>
```

- [ ] **Step 2: Verify and commit**

```bash
git add app/gallery/[slug]/page.tsx
git commit -m "feat(gallery-detail): bleed hero + italic title + painted divider"
```

---

### Task 4.4: Photography (index + detail)

**Files:**
- Modify: `app/photography/page.tsx`
- Modify: `app/photography/[series]/page.tsx`

- [ ] **Step 1: Apply the gallery card pattern to the photography index**

Each series card uses the same shape as the gallery card from Task 4.2 (repeated here so this task is self-contained):

```tsx
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'
// per series:
<Link href={`/photography/${s.slug}`} className="group block">
  <div className="relative aspect-[4/5] overflow-hidden">
    <BleedImage fill src={s.coverUrl} alt={s.title} sizes="(max-width:768px) 50vw, 33vw" />
  </div>
  <div className="mt-3">
    <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">Series</p>
    <h3 className="font-serif italic text-xl text-brand-cream mt-1">{s.title}</h3>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <PaintedUnderline width={120} delay={0} />
    </div>
  </div>
</Link>
```

- [ ] **Step 2: Update series detail (lightbox-supporting)**

Photo grid uses `<BleedImage fill>`. Lightbox close button: `font-mono text-[11px] tracking-widest uppercase text-brand-cream`. Add a `<RingedOrb size={28} />` at top-right and bottom-left of the lightbox container.

- [ ] **Step 3: Verify and commit**

```bash
git add app/photography
git commit -m "feat(photography): painterly index + lightbox styling"
```

---

### Task 4.5: Writing (index + post)

**Files:**
- Modify: `app/writing/page.tsx`
- Modify: `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Index — italic Cormorant titles, Plex Mono date eyebrow, painted dividers between cards**

```tsx
{posts.map(p => (
  <article key={p.slug} className="py-8">
    <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/60">
      {new Date(p.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
    </p>
    <h2 className="font-serif italic text-3xl text-brand-cream mt-2">
      <Link href={`/writing/${p.slug}`} className="hover:text-brand-amber">{p.title}</Link>
    </h2>
    <p className="font-serif text-brand-cream/80 mt-3 max-w-2xl">{p.excerpt}</p>
    <PaintedDivider />
  </article>
))}
```

- [ ] **Step 2: Post detail — single column 65ch, parchment surface variant**

The reading column is on the parchment surface (text-brand-night) so long reads stay legible:

```tsx
<article className="relative bg-brand-parchment/95 max-w-[65ch] mx-auto my-16 p-10 md:p-14 rounded-sm shadow-xl">
  <p className="font-mono text-[11px] tracking-widest uppercase text-brand-night/60">
    {new Date(post.date).toLocaleDateString(...)}
  </p>
  <h1 className="font-serif italic text-4xl text-brand-night mt-3">{post.title}</h1>
  <PaintedDivider color="#6B5BA8" width="100px" className="!my-6" />
  <div className="prose prose-lg font-serif text-brand-night/90"
       dangerouslySetInnerHTML={{ __html: post.content }} />
</article>
```

If the existing post renderer uses `<ReactMarkdown>` instead of dangerouslySetInnerHTML, keep that — only the wrapper styling changes.

- [ ] **Step 3: Commit**

```bash
git add app/writing
git commit -m "feat(writing): italic titles, parchment reading surface, painted dividers"
```

---

### Task 4.6: Video page

**Files:**
- Modify: `app/video/page.tsx`

- [ ] **Step 1: Wrap each thumbnail in `<BleedImage>` and the player in `<PaintedFrame>`**

```tsx
import PaintedFrame from '@/components/atmosphere/PaintedFrame'
// thumbnail card:
<BleedImage fill src={v.thumbnailUrl} alt={v.title} />
// embed player container:
<PaintedFrame className="aspect-video">
  <iframe src={v.embedUrl} className="w-full h-full" allowFullScreen />
</PaintedFrame>
```

Title/meta typography matches the gallery pattern.

- [ ] **Step 2: Commit**

```bash
git add app/video/page.tsx
git commit -m "feat(video): bleed thumbnails + painted-frame player"
```

---

### Task 4.7: Music page (with ambient pause)

**Files:**
- Modify: `app/music/page.tsx`

- [ ] **Step 1: Pause/resume ambient audio when this page mounts/unmounts**

Add at the top of the music page component:

```tsx
'use client'
import { useEffect } from 'react'
import { useMusic } from '@/context/MusicContext'
// ...
export default function MusicPage(/* props */) {
  const { pauseExternal, resumeExternal } = useMusic()
  useEffect(() => {
    pauseExternal()
    return () => resumeExternal()
  }, [pauseExternal, resumeExternal])
  // ... rest of page
}
```

If the music page is currently a server component, convert to a client component and pass any preloaded data via props/loaders.

- [ ] **Step 2: Restyle**

- Track list: `font-mono text-xs uppercase tracking-widest`, current track also gets italic Cormorant title
- Each track artwork wrapped in `<BleedImage>`
- Progress bar: thin amber bar with `transition-all`; on hover show a `<PaintedUnderline />` below

- [ ] **Step 3: Verify ambient audio behavior**

In the browser:
1. Toggle music ON via the floating button
2. Navigate to `/music`
3. Confirm the floating ambient pauses
4. Navigate back to `/`
5. Confirm ambient resumes

- [ ] **Step 4: Commit**

```bash
git add app/music/page.tsx
git commit -m "feat(music-page): pause ambient on mount; painterly track list"
```

---

### Task 4.8: Shop (index + detail) and cart drawer

**Files:**
- Modify: `app/shop/page.tsx`
- Modify: `app/shop/[slug]/page.tsx`
- Modify: any cart drawer component used (find via `grep -ri "CartDrawer\|cart" components/`)

- [ ] **Step 1: Shop index**

Cards on parchment surface for legibility — wrap each card with `bg-brand-parchment/90 p-4 rounded-sm`, image inside `<BleedImage>`, title `font-serif italic text-brand-night`, price `font-mono text-[12px] tracking-widest uppercase text-brand-night/75`.

- [ ] **Step 2: Shop detail**

Hero with `<BleedImage fill>` on left, parchment column on right with title/price/description, "Add to cart" as `<BrushButton variant="amber">`.

- [ ] **Step 3: Cart drawer**

Drawer has a parchment background, painted divider above totals, `<BrushButton>` for checkout.

- [ ] **Step 4: Commit**

```bash
git add app/shop components/cart # adjust path to actual cart component
git commit -m "feat(shop): parchment cards + painted CTAs + bleed product hero"
```

---

### Task 4.9: About page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Two-column layout, profile photo bleed, painted submit button**

```tsx
import BleedImage from '@/components/atmosphere/BleedImage'
import BrushButton from '@/components/atmosphere/BrushButton'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'
// ...
<section className="relative min-h-screen px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
  <div className="relative aspect-[4/5]">
    <BleedImage fill src={about.profilePhotoUrl} alt="Faezeh Ghavidel" />
  </div>
  <div className="text-brand-cream">
    <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/70">About</p>
    <h1 className="font-serif italic text-4xl md:text-5xl mt-3">Faezeh Ghavidel</h1>
    <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
    <div className="font-serif text-brand-cream/90 text-lg leading-relaxed whitespace-pre-line">
      {about.fullBio}
    </div>
    {/* contact form: existing logic untouched, just new classNames */}
    <form className="mt-12 space-y-4" /* keep existing onSubmit */>
      <label className="font-mono text-[11px] uppercase tracking-widest text-brand-cream/70">Name
        <input className="block w-full bg-transparent border-b border-brand-cream/40 py-2 font-serif text-brand-cream focus:outline-none focus:border-brand-amber"/>
      </label>
      <label className="font-mono text-[11px] uppercase tracking-widest text-brand-cream/70">Email
        <input type="email" className="block w-full bg-transparent border-b border-brand-cream/40 py-2 font-serif text-brand-cream focus:outline-none focus:border-brand-amber"/>
      </label>
      <label className="font-mono text-[11px] uppercase tracking-widest text-brand-cream/70">Message
        <textarea rows={4} className="block w-full bg-transparent border-b border-brand-cream/40 py-2 font-serif text-brand-cream focus:outline-none focus:border-brand-amber"/>
      </label>
      <BrushButton type="submit">Send via WhatsApp</BrushButton>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat(about): two-column bleed portrait + italic bio + painted form"
```

---

## Phase 5 — Admin (painterly variant)

### Task 5.1: Fix login page to render outside the admin layout

The admin login at `app/admin/page.tsx` is currently rendered inside `app/admin/layout.tsx`, which forces an `<AdminNav>` to display even before authentication.

**Files:**
- Modify: `app/admin/layout.tsx`
- Confirm: `app/admin/page.tsx` already renders the standalone login

- [ ] **Step 1: Conditionally render the admin shell only when authenticated**

Make the layout a server component that checks auth and either renders the shell or just the children:

```tsx
// app/admin/layout.tsx
import AdminNav from '@/components/admin/AdminNav'
import { auth } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) {
    // login page renders standalone; no shell
    return <div className="min-h-screen flex items-center justify-center bg-brand-night">{children}</div>
  }
  return (
    <div className="min-h-screen flex bg-brand-parchment">
      <AdminNav />
      <main className="flex-1 ml-56 p-8 overflow-y-auto relative">{children}</main>
    </div>
  )
}
```

The proxy still redirects unauthenticated requests on inner admin paths back to `/admin`, so this branch only renders for the login page itself.

- [ ] **Step 2: Verify**

Hard-refresh `/admin` while signed out. The login card should appear centered on a `bg-brand-night` page with no sidebar. After signing in, dashboard appears with sidebar.

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "fix(admin): hide AdminNav on the login page (unauth users)"
```

---

### Task 5.2: Painterly admin shell

**Files:**
- Modify: `app/admin/layout.tsx`
- Modify: `components/admin/AdminNav.tsx`

- [ ] **Step 1: Restyle AdminNav (sidebar)**

Replace the contents of `AdminNav.tsx` to use Cormorant brand + Plex Mono links + amber active:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const items = [
  { href: '/admin/dashboard',  label: 'Dashboard'   },
  { href: '/admin/gallery',    label: 'Gallery'     },
  { href: '/admin/photography',label: 'Photography' },
  { href: '/admin/writing',    label: 'Writing'     },
  { href: '/admin/video',      label: 'Video'       },
  { href: '/admin/music',      label: 'Music'       },
  { href: '/admin/shop',       label: 'Shop'        },
  { href: '/admin/orders',     label: 'Orders'      },
  { href: '/admin/homepage',   label: 'Homepage'    },
  { href: '/admin/about',      label: 'About'       },
  { href: '/admin/settings',   label: 'Settings'    },
]

export default function AdminNav() {
  const path = usePathname()
  return (
    <aside className="fixed top-0 bottom-0 left-0 w-56 bg-brand-night flex flex-col z-30">
      <div className="p-5 border-b border-brand-cream/10">
        <p className="font-serif italic text-brand-cream text-xl">faavidel</p>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/40 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {items.map(({ href, label }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`block px-5 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors
                ${active
                  ? 'text-brand-amber border-l-2 border-brand-amber pl-[18px]'
                  : 'text-brand-cream/55 hover:text-brand-cream hover:bg-brand-cream/5'}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/admin' })}
        className="px-5 py-4 font-mono text-[11px] tracking-widest uppercase text-brand-cream/40 hover:text-brand-cream border-t border-brand-cream/10"
      >
        Sign out
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Painterly work area in admin layout**

Replace the authenticated branch of `app/admin/layout.tsx`:

```tsx
return (
  <div className="min-h-screen flex bg-brand-parchment text-brand-night">
    <AdminNav />
    <main className="flex-1 ml-56 p-8 overflow-y-auto relative">
      {/* low-opacity painting ghost */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.07] bg-cover bg-center"
        style={{ backgroundImage: "url('https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770985530.jpg')" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 55% at 22% 38%, rgba(107,91,168,0.16), transparent 70%),
            radial-gradient(ellipse 55% 50% at 75% 32%, rgba(216,110,120,0.13), transparent 70%),
            radial-gradient(ellipse 70% 50% at 50% 78%, rgba(232,184,111,0.16), transparent 70%)
          `,
        }}
      />
      <div className="relative">{children}</div>
    </main>
  </div>
)
```

The fixed `<AtmosphericLayer />` from the root layout still sits behind everything, but admin uses its own subdued ghost + washes for productivity.

- [ ] **Step 3: Verify**

Sign in. Navigate every admin route — sidebar shows italic brand, Plex Mono links, amber active link with left border. Work area is parchment with subtle painted ghost. Tables remain readable.

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx components/admin/AdminNav.tsx
git commit -m "feat(admin): painterly shell — italic brand, Plex Mono nav, parchment work area"
```

---

### Task 5.3: Restyle each admin page

**Files:**
- Modify: every file under `app/admin/*/page.tsx`

For each page, follow the same pattern (apply per file, commit per file):

- Page heading: `<h1 className="font-serif italic text-3xl text-brand-night">…</h1>`
- Sub-heading / breadcrumb: `<p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">…</p>`
- Table headers: `font-mono text-[10px] tracking-widest uppercase text-brand-night/55`
- Status pills:
  - Published / Active: `bg-brand-amber text-brand-night px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase`
  - Draft / Archived: `bg-brand-night/10 text-brand-night/55 …`
- Inputs: `bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris`
- Submit/save buttons: `<BrushButton type="submit" variant="amber">Save</BrushButton>`
- Delete buttons: `font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night`

- [ ] **Step 1: Run a dry-run search to enumerate `bg-ocean`/`text-charcoal`/`text-seafoam` occurrences in admin**

```bash
grep -rE "bg-ocean|text-charcoal|text-seafoam|text-burnt|bg-off-white|bg-sand" app/admin components/admin || true
```

- [ ] **Step 2: Per-file restyle**

Iterate the matched files. Apply the patterns above. After each file:

```bash
git add app/admin/<that-file>
git commit -m "feat(admin/<route>): brand tokens + italic heading + brush buttons"
```

- [ ] **Step 3: Final verification**

Sign in, visit every admin route. Tables scan-able, forms readable, no leftover ocean-palette classes. `npm run build` should succeed.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Fix any errors surfaced.

---

## Phase 6 — Seeding

### Task 6.1: Seed gallery with the 18 World Art Dubai 2026 paintings

**Files:**
- Create: `scripts/seed-paintings-wad.ts`

- [ ] **Step 1: Write the seed script**

```ts
// scripts/seed-paintings-wad.ts
import 'dotenv/config'
import { put, list } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

interface InputPainting { title: string; url: string }
interface Artwork {
  slug: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  year: number
  order: number
  createdAt: string
}

const slugify = (s: string) => s
  .toLowerCase()
  .replace(/['"]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

async function uploadIfMissing(slug: string, sourceUrl: string): Promise<string> {
  const target = `gallery/${slug}.jpg`
  // already there?
  const existing = await list({ prefix: target })
  const hit = existing.blobs.find(b => b.pathname === target)
  if (hit) return hit.url

  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`fetch ${sourceUrl} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const result = await put(target, buf, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
  })
  return result.url
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) { console.error('BLOB_READ_WRITE_TOKEN required'); process.exit(1) }

  const file = path.resolve('scripts/artworks-wad2026.json')
  const inputs: InputPainting[] = JSON.parse(await fs.readFile(file, 'utf8'))
  const seen = new Set<string>()
  const artworks: Artwork[] = []

  for (let i = 0; i < inputs.length; i++) {
    const p = inputs[i]
    let slug = slugify(p.title)
    let n = 2
    while (seen.has(slug)) slug = `${slugify(p.title)}-${n++}`
    seen.add(slug)

    process.stdout.write(`[${i+1}/${inputs.length}] ${slug} … `)
    const blobUrl = await uploadIfMissing(slug, p.url)
    artworks.push({
      slug, title: p.title,
      description: '',
      tags: ['painting', '2024', 'wad-2026'],
      imageUrl: blobUrl,
      year: 2024, order: i + 1,
      createdAt: new Date().toISOString(),
    })
    console.log('ok')
  }

  // write per-artwork blobs and the index
  for (const a of artworks) {
    await put(`content/gallery/${a.slug}.json`, JSON.stringify(a, null, 2), {
      access: 'public', contentType: 'application/json', addRandomSuffix: false,
    })
  }
  const index = {
    artworks: artworks.map(a => ({
      slug: a.slug, title: a.title, imageUrl: a.imageUrl, tags: a.tags, order: a.order,
    })),
  }
  await put('content/gallery.json', JSON.stringify(index, null, 2), {
    access: 'public', contentType: 'application/json', addRandomSuffix: false,
  })
  console.log(`seeded ${artworks.length} paintings`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Run it against the production Blob**

```bash
BLOB_READ_WRITE_TOKEN=<token-from-vercel-or-handoff> npx tsx scripts/seed-paintings-wad.ts
```

Expected: 18 lines of `[N/18] <slug> … ok`, ending with `seeded 18 paintings`.

- [ ] **Step 3: Verify in dev**

`npm run dev` → http://localhost:3000/gallery should show all 18 paintings (the gallery page reads from Blob via `lib/blob.ts:readJSON`).

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-paintings-wad.ts
git commit -m "feat(seed): script to upload the 18 WAD 2026 paintings to Blob"
```

---

## Phase 7 — Polish, mobile, performance

### Task 7.1: Reduced motion sweep

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Consolidate reduced-motion fallbacks**

Replace any scattered `@media (prefers-reduced-motion)` blocks with a single section at the bottom of `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  /* keep underline reveal final state */
  [style*="painted-underline-draw"] { width: var(--underline-final) !important; }
  [style*="atm-cycle"]    { opacity: 1 !important; transform: none !important; }
  [style*="atm-paint-on"] { stroke-dashoffset: 0 !important; opacity: 0.85 !important; }
  [style*="frame-draw"]   { stroke-dashoffset: 0 !important; }
}
```

- [ ] **Step 2: Verify in DevTools**

Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload home page — paintings show static, brushstrokes already drawn, orbs not pulsing.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(a11y): unified prefers-reduced-motion fallbacks"
```

---

### Task 7.2: Mobile pass

**Files:**
- Modify: `components/atmosphere/AtmosphericLayer.tsx`

- [ ] **Step 1: Reduce layer count + brushstroke count on small screens**

Add a `useEffect` that watches `(max-width: 767px)`:

```tsx
'use client'
import { useEffect, useState } from 'react'
// ... existing imports
export default function AtmosphericLayer({ paintings = DEFAULT_PAINTINGS, /* ... */ }: AtmosphericLayerProps) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)')
    const apply = () => setMobile(m.matches)
    apply()
    m.addEventListener('change', apply)
    return () => m.removeEventListener('change', apply)
  }, [])
  const slots = mobile ? paintings.slice(0, 1) : paintings.slice(0, 3)
  // ... and reduce strokes:
  const strokeData = mobile
    ? STROKE_DATA.slice(0, 2)
    : STROKE_DATA
  // ...
}
```

(Lift the strokes array to a top-level `STROKE_DATA` constant inside the file.)

- [ ] **Step 2: Verify on a phone-width browser**

DevTools → device toolbar → iPhone 12. Confirm one painting (no crossfade), 2 brushstrokes, no orbs.

- [ ] **Step 3: Commit**

```bash
git add components/atmosphere/AtmosphericLayer.tsx
git commit -m "perf(atmosphere): reduce layers + strokes on mobile"
```

---

### Task 7.3: Build, lint, lighthouse

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: passes with no errors. Address any TypeScript errors that surface (most likely from leftover `text-charcoal` etc. — grep and fix any stragglers).

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 3: Run dev and run a Lighthouse audit on `/`**

`npm run dev`, then in Chrome → DevTools → Lighthouse → Performance + Accessibility + Best Practices → analyze `/`.

Targets:
- Performance ≥ 80
- Accessibility ≥ 95
- Best Practices ≥ 90

If Performance < 80, common culprits to fix:
- `<Image priority>` only on the first painting slot
- Drop unused `framer-motion` features
- Verify images return WebP/AVIF (`next/image` handles this; ensure no `<img>` raw tags)

- [ ] **Step 4: Final commit**

If any tweaks needed for Lighthouse:

```bash
git add -A
git commit -m "perf: tweaks for Lighthouse targets"
```

- [ ] **Step 5: Push**

```bash
git push origin main
```

Vercel auto-deploys; production URL goes painterly + plays piano.

---

## Acceptance verification (post-deploy)

After Vercel finishes building `https://faavidel.art`:

- [ ] Home: paintings cycle, brushstrokes paint, orbs pulse, italic Cormorant hero
- [ ] Music toggle plays/mutes piano; persists across navigation
- [ ] `/music` pauses ambient, restoring on leave
- [ ] `/gallery` shows 18 WAD 2026 paintings
- [ ] Every page uses brand tokens — no leftover ocean/charcoal palette
- [ ] Admin login centers on night background with no sidebar; signed-in admin shows painterly shell
- [ ] DevTools "prefers-reduced-motion: reduce" → static atmosphere, no looping animations
- [ ] iPhone-width view: one painting, no crossfade, ≤2 brushstrokes, smooth scroll
- [ ] Lighthouse on `/`: Perf ≥ 80, A11y ≥ 95
- [ ] No console errors in production build
