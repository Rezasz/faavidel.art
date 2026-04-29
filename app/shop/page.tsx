'use client'
import { useEffect, useState, Suspense } from 'react'
import { ProductIndex } from '@/lib/types'
import ProductGrid from '@/components/shop/ProductGrid'
import CartDrawer from '@/components/shop/CartDrawer'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useSearchParams } from 'next/navigation'

function SuccessHandler() {
  const params = useSearchParams()
  useEffect(() => {
    if (params.get('success')) alert('Order placed! Thank you.')
  }, [params])
  return null
}

function ShopContent() {
  const [products, setProducts] = useState<ProductIndex['products']>([])
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    fetch('/api/content/shop/index').then(r => r.ok ? r.json() : null).then(d => setProducts(d?.products ?? []))
  }, [])

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Prints &amp; products</p>
          <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Shop</h1>
          <div className="w-12 h-px bg-brand-amber/60 mt-3" />
        </div>
        <button onClick={() => setCartOpen(true)} className="relative mt-2 text-brand-cream hover:text-brand-amber transition-colors" data-cursor-hover>
          <ShoppingBag size={24} />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-amber text-brand-night text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {count}
            </span>
          )}
        </button>
      </div>
      {products.length === 0 ? (
        <p className="font-serif italic text-brand-cream/60 text-lg">No products yet.</p>
      ) : (
        <ProductGrid products={products} />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}

export default function ShopPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SuccessHandler />
      </Suspense>
      <ShopContent />
    </>
  )
}
