'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const items = [
  { href: '/admin/dashboard',  label: 'Dashboard'   },
  { href: '/admin/gallery',    label: 'Gallery'     },
  { href: '/admin/writing',    label: 'Writing'     },
  { href: '/admin/music',      label: 'Music'       },
  { href: '/admin/shop',       label: 'Shop'        },
  { href: '/admin/homepage',   label: 'Homepage'    },
  { href: '/admin/about',      label: 'About'       },
  { href: '/admin/settings',   label: 'Settings'    },
]

export default function AdminNav() {
  const path = usePathname()
  return (
    <aside className="fixed top-0 bottom-0 left-0 w-56 bg-brand-night flex flex-col z-30">
      <div className="p-5 border-b border-brand-cream/10">
        <p className="font-serif italic text-brand-cream text-xl">faavidel</p>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/40 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {items.map(({ href, label }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`block px-5 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors
                ${active
                  ? 'text-brand-amber border-l-2 border-brand-amber pl-[18px]'
                  : 'text-brand-cream/55 hover:text-brand-cream hover:bg-brand-cream/5'}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/admin' })}
        className="px-5 py-4 font-mono text-[11px] tracking-widest uppercase text-brand-cream/40 hover:text-brand-cream border-t border-brand-cream/10 text-left"
      >
        Sign out
      </button>
    </aside>
  )
}
