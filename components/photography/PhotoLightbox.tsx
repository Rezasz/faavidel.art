'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Photo } from '@/lib/types'
import BleedImage from '@/components/atmosphere/BleedImage'

export default function PhotoLightbox({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null)

  const prev = () => setActive(i => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setActive(i => (i !== null ? (i + 1) % photos.length : null))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActive(i)}
            className="relative aspect-square overflow-hidden group"
            data-cursor-hover
          >
            <BleedImage fill src={photo.url} alt={photo.caption} sizes="(max-width:768px) 50vw, 33vw" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-brand-night/95 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-4 right-4 text-brand-cream/80 hover:text-brand-amber flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase bg-brand-night/40 backdrop-blur px-3 py-2 rounded-full"
              onClick={() => setActive(null)}
            >
              <X size={16} /> Close
            </button>
            <button className="absolute left-4 text-brand-cream/80 hover:text-brand-amber" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={36} />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={photos[active].url}
                alt={photos[active].caption}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-full"
              />
              {photos[active].caption && (
                <p className="text-brand-cream/70 font-mono text-[10px] tracking-widest uppercase text-center mt-3">{photos[active].caption}</p>
              )}
            </motion.div>
            <button className="absolute right-4 text-brand-cream/80 hover:text-brand-amber" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={36} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
