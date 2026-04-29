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
  scale?: number          // displacement strength (default 6)
  sizes?: string
}

export default function BleedImage({
  src, alt, width, height, fill, className = '', priority, scale = 6, sizes,
}: BleedImageProps) {
  const id = useId().replace(/[:]/g, '-')
  const filterId = `bleed-${id}`
  const wrapperClass = fill ? `absolute inset-0 ${className}` : `relative ${className}`

  return (
    <div className={wrapperClass} style={{ filter: `url(#${filterId})` }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={3}/>
            <feDisplacementMap in="SourceGraphic" scale={scale}/>
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
