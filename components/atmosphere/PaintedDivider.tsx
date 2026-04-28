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
