'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProductIndex } from '@/lib/types'

type ProductSummary = ProductIndex['products'][number]

export default function ProductCard({ product, index }: { product: ProductSummary; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block" data-cursor-hover>
        <div className="aspect-[3/4] overflow-hidden rounded bg-off-white relative">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ocean/90 p-4">
            <span className="text-white font-sans text-xs tracking-wider uppercase">View details →</span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors">{product.title}</h3>
          <p className="font-sans text-sm text-burnt mt-0.5">${product.price.toFixed(2)}</p>
          {product.stock === 0 && (
            <p className="font-sans text-xs text-gray-400 mt-0.5">Sold out</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
