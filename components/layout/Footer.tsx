'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export default function Footer() {
  const path = usePathname()
  if (path.startsWith('/admin')) return null

  return (
    <footer className="relative z-10 px-6 md:px-12 pt-4 pb-10 text-brand-cream/70">
      <PaintedDivider />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-serif italic text-lg text-brand-cream">faavidel</p>
        <div className="flex gap-6 font-mono text-[10px] tracking-widest uppercase">
          <Link href="https://www.instagram.com/faa.videl" target="_blank">Instagram</Link>
          <Link href="https://wa.me/971555895441" target="_blank">WhatsApp</Link>
          <Link href="https://linktr.ee/faavidel" target="_blank">Linktree</Link>
          <Link href="mailto:info@faavidel.art">Email</Link>
        </div>
        <p className="font-mono text-[10px] tracking-widest uppercase opacity-60">© Faezeh Ghavidel</p>
      </div>
    </footer>
  )
}
