'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'

interface Props {
  slug: string
  title: string
  imageUrl: string
  tags: string[]
  index: number
  total: number
}

export default function ArtworkCard({ slug, title, imageUrl, index, total }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/gallery/${slug}`} className="group block" data-cursor-hover>
        <div className="relative aspect-[4/5] overflow-hidden">
          <BleedImage fill src={imageUrl} alt={title} sizes="(max-width:768px) 50vw, 33vw" />
        </div>
        <div className="mt-3 inline-block bg-brand-night/85 backdrop-blur-md rounded-sm px-3 py-2 max-w-full">
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/70">
            № {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h3 className="font-serif italic text-xl text-brand-cream mt-1 leading-tight">{title}</h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <PaintedUnderline width={120} delay={0} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
