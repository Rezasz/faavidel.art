'use client'
import Image from 'next/image'

const DEFAULT_PAINTING =
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770967843.jpg'

interface AtmosphericLayerProps {
  paintings?: string[]
  darken?: number
  showOrbs?: boolean
  showStrokes?: boolean
  className?: string
}

export default function AtmosphericLayer({
  paintings,
  darken = 0.55,
  className = '',
}: AtmosphericLayerProps) {
  const src = paintings?.[0] ?? DEFAULT_PAINTING

  return (
    <div aria-hidden className={`fixed inset-0 -z-10 overflow-hidden bg-brand-night ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 25%, rgba(14,10,28,${darken}) 95%),
            linear-gradient(180deg, rgba(14,10,28,${darken * 0.5}) 0%, transparent 30%, transparent 65%, rgba(14,10,28,${darken * 0.7}) 100%)
          `,
        }}
      />
    </div>
  )
}
