'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import RingedOrb from './RingedOrb'

const DEFAULT_PAINTINGS = [
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770967843.jpg',
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1770985530.jpg',
  'https://d1l8km4g5s76x5.cloudfront.net/Production/art_zone_image/2049/47601/main_artwork_2049_47601_46724_1762981010.jpg',
]

const STROKE_DATA = [
  { d: 'M-50 180 Q 250 80 600 200 T 1200 220 T 1700 180', s: '#FBE7D0', w: 2,   delay:  0   },
  { d: 'M-50 250 Q 300 140 700 270 T 1700 250',           s: '#E8B86F', w: 3,   delay: -1.6 },
  { d: 'M-50 720 Q 350 640 750 700 T 1300 720 T 1700 700', s: '#FBE7D0', w: 2.5, delay: -3.2 },
  { d: 'M50 800 Q 400 740 800 790 T 1700 770',            s: '#D86E78', w: 2,   delay: -4.8 },
  { d: 'M-50 460 Q 220 420 400 460 T 800 470',            s: '#FBE7D0', w: 1.5, delay: -6.4 },
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
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = window.matchMedia('(max-width: 767px)')
    const apply = () => setMobile(m.matches)
    apply()
    m.addEventListener('change', apply)
    return () => m.removeEventListener('change', apply)
  }, [])

  const slots = mobile ? paintings.slice(0, 1) : paintings.slice(0, 3)
  const cycleSeconds = slots.length * 10

  return (
    <div aria-hidden className={`fixed inset-0 -z-10 overflow-hidden bg-brand-night ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="atm-bleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={3} result="t">
              <animate attributeName="baseFrequency" dur="28s" values="0.012;0.018;0.012" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="t" scale={mobile ? 8 : 14}/>
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
            {STROKE_DATA.slice(0, mobile ? 2 : 5).map((b, i) => (
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
          <RingedOrb size={mobile ? 48 : 64} className="absolute top-[18%] left-[78%]" />
          {!mobile && <RingedOrb size={36} className="absolute top-[52%] left-[8%]" delay={-2} rings="solid" />}
        </>
      )}
    </div>
  )
}
