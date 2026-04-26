'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  slug: string
  title: string
  imageUrl: string
  tags: string[]
  index: number
}

export default function ArtworkCard({ slug, title, imageUrl, tags, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/gallery/${slug}`} className="group block" data-cursor-hover>
        <div className="aspect-[4/3] overflow-hidden rounded bg-off-white relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/55 transition-all duration-300 flex items-end p-5">
            <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {title}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors">{title}</h3>
          <div className="flex gap-2 flex-wrap mt-1">
            {tags.slice(0, 3).map(t => (
              <span key={t} className="font-sans text-[10px] tracking-wider uppercase text-seafoam">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
