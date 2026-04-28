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
