'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Image, Camera, FileText, Video, Music,
  ShoppingBag, Package, Home, User, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/photography', label: 'Photography', icon: Camera },
  { href: '/admin/writing', label: 'Writing', icon: FileText },
  { href: '/admin/video', label: 'Video', icon: Video },
  { href: '/admin/music', label: 'Music', icon: Music },
  { href: '/admin/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/about', label: 'About', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-charcoal flex flex-col z-40">
      <div className="p-5 border-b border-white/10">
        <p className="font-serif text-white text-lg tracking-widest">faavidel</p>
        <p className="font-sans text-xs text-white/40 tracking-wider mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 font-sans text-xs tracking-wider transition-colors
                ${active ? 'bg-ocean text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/admin' })}
        className="flex items-center gap-3 px-5 py-4 font-sans text-xs tracking-wider text-white/40 hover:text-white border-t border-white/10 transition-colors"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    </aside>
  )
}
