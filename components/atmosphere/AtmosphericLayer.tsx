'use client'
import Image from 'next/image'

const DEFAULT_PAINTINGS = [
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770967843.jpg',
]

interface AtmosphericLayerProps {
  paintings?: string[]
  darken?: number
  showOrbs?: boolean
  showStrokes?: boolean
  className?: string
}

export default function AtmosphericLayer({
  paintings = DEFAULT_PAINTINGS,
  darken = 0.6,
  className = '',
}: AtmosphericLayerProps) {
  const src = paintings[0] ?? DEFAULT_PAINTINGS[0]

  return (
    <div aria-hidden className={`fixed inset-0 -z-10 overflow-hidden bg-brand-night ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="atm-bleed-static">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={3}/>
            <feDisplacementMap in="SourceGraphic" scale={10}/>
          </filter>
        </defs>
      </svg>

      {/* single static painting with a one-shot turbulent edge */}
      <div className="absolute inset-0" style={{ filter: 'url(#atm-bleed-static)' }}>
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
      </div>

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 30%, rgba(14,10,28,${darken * 0.95}) 95%),
            linear-gradient(180deg, rgba(14,10,28,${darken * 0.5}) 0%, transparent 30%, transparent 65%, rgba(14,10,28,${darken * 0.7}) 100%)
          `,
        }}
      />

      {/* static film grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.14,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />
    </div>
  )
}
