'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

const links = [
  { href: '/gallery',     label: 'Paintings' },
  { href: '/photography', label: 'Photography' },
  { href: '/writing',     label: 'Writing' },
  { href: '/video',       label: 'Video' },
  { href: '/music',       label: 'Music' },
  { href: '/shop',        label: 'Shop' },
  { href: '/about',       label: 'About' },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  if (path.startsWith('/admin')) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-9 py-5 flex items-center gap-7 text-brand-cream">
      <Link href="/" className="font-serif italic text-2xl tracking-wide hover:text-brand-amber transition-colors">faavidel</Link>
      <div className="hidden md:flex items-center gap-7 ml-auto">
        {links.map(l => {
          const active = path.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] tracking-widest uppercase transition-colors
                ${active ? 'text-brand-amber' : 'text-brand-cream/70 hover:text-brand-cream'}`}
            >
              {active && <span aria-hidden className="text-brand-amber mr-1">·</span>}
              {l.label}
            </Link>
          )
        })}
        <Link
          href="/shop"
          aria-label="Cart"
          className="relative font-mono text-[11px] tracking-widest uppercase text-brand-cream/70 hover:text-brand-cream transition-colors"
        >
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-brand-amber text-brand-night text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {count}
            </span>
          )}
        </Link>
      </div>
      <div className="md:hidden ml-auto flex items-center gap-5">
        <Link
          href="/shop"
          aria-label="Cart"
          className="relative font-mono text-[11px] tracking-widest uppercase text-brand-cream/80"
        >
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-brand-amber text-brand-night text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {count}
            </span>
          )}
        </Link>
        <button
          className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/80"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-brand-night/95 backdrop-blur md:hidden flex flex-col py-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-[12px] tracking-widest uppercase text-brand-cream/80 px-6 py-3"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
