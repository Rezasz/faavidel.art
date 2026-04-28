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
