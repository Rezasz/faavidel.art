'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductIndex } from '@/lib/types'
import BleedImage from '@/components/atmosphere/BleedImage'

type ProductSummary = ProductIndex['products'][number]

export default function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block bg-brand-parchment/95 p-4 transition-shadow hover:shadow-2xl" data-cursor-hover>
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.images[0] && (
            <BleedImage fill src={product.images[0]} alt={product.title} sizes="(max-width:768px) 50vw, 33vw" />
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-serif italic text-xl text-brand-night">{product.title}</h3>
          <p className="font-mono text-[12px] tracking-widest uppercase text-brand-night/75 mt-1">${product.price.toFixed(2)}</p>
          {product.stock === 0 && (
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-rose mt-1">Sold out</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
