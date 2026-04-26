'use client'
import { useEffect, useState, Suspense } from 'react'
import { ProductIndex } from '@/lib/types'
import ProductGrid from '@/components/shop/ProductGrid'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useSearchParams } from 'next/navigation'

function SuccessHandler() {
  const params = useSearchParams()
  useEffect(() => {
    if (params.get('success')) {
      alert('Order placed! Thank you.')
    }
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
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection className="flex justify-between items-start mb-8">
        <div>
          <p className="section-label">Prints & Products</p>
          <h1 className="section-title">Shop</h1>
          <div className="section-rule" />
        </div>
        <button onClick={() => setCartOpen(true)} className="relative mt-2" data-cursor-hover>
          <ShoppingBag size={24} className="text-ocean" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
              {count}
            </span>
          )}
        </button>
      </AnimatedSection>
      {products.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No products yet.</p>
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
