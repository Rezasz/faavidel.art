'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Product } from '@/lib/types'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/shop/CartDrawer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`/api/content/shop/${slug}`).then(r => r.ok ? r.json() : null).then(setProduct)
  }, [slug])

  if (!product) return <div className="min-h-screen flex items-center justify-center font-serif text-gray-400 pt-16">Loading...</div>

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
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <Link href="/shop" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">← Back to Shop</Link>
      </AnimatedSection>
      <div className="grid md:grid-cols-2 gap-12">
        <AnimatedSection>
          <div className="aspect-[3/4] rounded overflow-hidden bg-off-white relative mb-3">
            {product.images[activeImg] && (
              <Image src={product.images[activeImg]} alt={product.title} fill className="object-cover" />
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-16 h-16 rounded overflow-hidden relative border-2 transition-colors ${activeImg === i ? 'border-burnt' : 'border-transparent'}`}>
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} direction="left">
          <h1 className="font-serif text-3xl text-charcoal mb-2">{product.title}</h1>
          <p className="font-sans text-2xl text-burnt mb-6">${product.price.toFixed(2)}</p>
          <div className="w-8 h-0.5 bg-burnt mb-6" />
          <p className="font-serif text-charcoal/75 leading-relaxed mb-8">{product.description}</p>
          {product.stock > 0 ? (
            <button onClick={handleAdd}
              className="w-full bg-burnt text-white font-sans text-xs tracking-wider uppercase py-4 rounded hover:bg-burnt/85 transition-colors mb-3">
              Add to Cart
            </button>
          ) : (
            <div className="w-full border border-gray-200 text-gray-400 font-sans text-xs tracking-wider uppercase py-4 rounded text-center">
              Sold Out
            </div>
          )}
        </AnimatedSection>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  )
}
