'use client'
import { useState } from 'react'
import ArtworkCard from './ArtworkCard'
import { GalleryIndex } from '@/lib/types'

interface Props {
  artworks: GalleryIndex['artworks']
}

export default function GalleryGrid({ artworks }: Props) {
  const allTags = Array.from(new Set(artworks.flatMap(a => a.tags)))
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? artworks
    : artworks.filter(a => a.tags.includes(active))

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-10">
        {['All', ...allTags].map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors
              ${active === tag
                ? 'border-brand-amber bg-brand-amber text-brand-night'
                : 'border-brand-cream/30 text-brand-cream/80 hover:bg-brand-amber hover:text-brand-night'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="relative">
        {/* Continuous diagonal light sweep — cheap, GPU-accelerated */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ animation: 'gallery-sweep 9s ease-in-out infinite' }}
        >
          <div
            className="absolute -inset-y-[20%] w-[40%]"
            style={{
              background:
                'linear-gradient(115deg, transparent 0%, rgba(232,184,111,0.18) 45%, rgba(255,229,168,0.32) 50%, rgba(232,184,111,0.18) 55%, transparent 100%)',
              mixBlendMode: 'screen',
              filter: 'blur(40px)',
              transform: 'translate3d(0,0,0)',
            }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative">
          {filtered.map((art, i) => (
            <ArtworkCard key={art.slug} {...art} index={i} total={filtered.length} />
          ))}
        </div>
      </div>
    </>
  )
}
