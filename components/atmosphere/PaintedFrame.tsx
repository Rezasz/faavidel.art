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
