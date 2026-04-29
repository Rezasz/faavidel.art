'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product } from '@/lib/types'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/shop/CartDrawer'
import Link from 'next/link'
import BleedImage from '@/components/atmosphere/BleedImage'
import BrushButton from '@/components/atmosphere/BrushButton'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`/api/content/shop/${slug}`).then(r => r.ok ? r.json() : null).then(setProduct)
  }, [slug])

  if (!product) return <div className="min-h-screen flex items-center justify-center font-serif italic text-brand-cream/60 text-lg pt-16">Loading…</div>

  const handleAdd = () => {
    addItem({
      productSlug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0] ?? '',
    })
    setCartOpen(true)
  }

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-5xl mx-auto">
      <Link href="/shop" className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65 hover:text-brand-amber transition-colors mb-10 inline-block">← Back to shop</Link>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden mb-3">
            {product.images[activeImg] && (
              <BleedImage fill src={product.images[activeImg]} alt={product.title} priority sizes="(max-width:768px) 100vw, 50vw" />
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-16 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-brand-amber' : 'border-transparent hover:border-brand-cream/40'}`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="text-brand-cream">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">${product.price.toFixed(2)}</p>
          <h1 className="font-serif italic text-4xl md:text-5xl mt-2">{product.title}</h1>
          <div className="w-12 h-px bg-brand-amber/60 mt-3 mb-6" />
          <p className="font-serif text-brand-cream/85 text-lg leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>
          {product.stock > 0 ? (
            <BrushButton onClick={handleAdd}>Add to cart</BrushButton>
          ) : (
            <div className="inline-block font-mono text-[11px] tracking-widest uppercase text-brand-rose border border-brand-rose/40 px-6 py-3">Sold out</div>
          )}
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
