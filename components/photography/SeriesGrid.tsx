'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PhotographyIndex } from '@/lib/types'
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'

export default function SeriesGrid({ series }: { series: PhotographyIndex['series'] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {series.map((s, i) => (
        <motion.div
          key={s.slug}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        >
          <Link href={`/photography/${s.slug}`} className="group block" data-cursor-hover>
            <div className="relative aspect-[4/5] overflow-hidden">
              <BleedImage fill src={s.coverUrl} alt={s.title} sizes="(max-width:768px) 50vw, 33vw" />
            </div>
            <div className="mt-3">
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">Series</p>
              <h3 className="font-serif italic text-xl text-brand-cream mt-1">{s.title}</h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <PaintedUnderline width={120} delay={0} />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
