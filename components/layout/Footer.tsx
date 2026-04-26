import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/50 font-sans text-xs tracking-wider">
      <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          © {new Date().getFullYear()}{' '}
          <span className="text-seafoam">faavidel.art</span> — All rights reserved
        </div>
        <div className="flex gap-8">
          <Link href="/gallery" className="hover:text-white transition-colors uppercase">Gallery</Link>
          <Link href="/shop" className="hover:text-white transition-colors uppercase">Shop</Link>
          <Link href="/about" className="hover:text-white transition-colors uppercase">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
