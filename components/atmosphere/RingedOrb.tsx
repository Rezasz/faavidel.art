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
