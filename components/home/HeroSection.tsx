'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import HeroParticles from '@/components/ui/HeroParticles'

interface Props {
  title: string
  subtitle: string
  buttonText: string
}

export default function HeroSection({ title, subtitle, buttonText }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.9 })
    tl.fromTo(
      titleRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out' }
    )
    .fromTo(subRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: 'left' }, '-=0.2')
    .fromTo(btnRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.1')
  }, [])

  return (
    <section className="relative bg-ocean min-h-[88vh] flex items-center justify-center overflow-hidden">
      <HeroParticles />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(95,168,169,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(166,61,64,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10 text-center px-6">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-seafoam mb-5">
          Art · Photography · Music · Writing
        </p>
        <h1
          ref={titleRef}
          className="font-serif text-white tracking-[0.15em] leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          {title}
        </h1>
        <p ref={subRef} className="font-serif italic text-white/60 text-lg mb-8">
          {subtitle}
        </p>
        <div ref={ruleRef} className="w-10 h-0.5 bg-burnt mx-auto mb-8" />
        <Link
          ref={btnRef}
          href="/gallery"
          className="inline-block bg-burnt text-white font-sans text-xs tracking-wider uppercase px-9 py-3.5 rounded hover:bg-burnt/90 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
