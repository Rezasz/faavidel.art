'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const links = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/photography', label: 'Photography' },
  { href: '/writing', label: 'Writing' },
  { href: '/music', label: 'Music' },
  { href: '/video', label: 'Video' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ocean h-16 flex items-center justify-between px-8 md:px-12">
      <Link href="/" className="text-white font-serif text-xl tracking-widest">
        faavidel
      </Link>

      <div className="hidden md:flex gap-8">
        {links.map((l, i) => (
          <motion.div
            key={l.href}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Link
              href={l.href}
              className="font-sans text-xs tracking-wider uppercase text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/shop" className="relative">
          <ShoppingBag className="text-white w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
              {count}
            </span>
          )}
        </Link>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-ocean border-t border-white/10 flex flex-col p-6 gap-4 md:hidden"
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-sans text-sm tracking-wider uppercase text-white/80 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2 px-4 rounded text-center"
            >
              Shop
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
