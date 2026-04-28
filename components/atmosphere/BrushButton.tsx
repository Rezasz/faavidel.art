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
