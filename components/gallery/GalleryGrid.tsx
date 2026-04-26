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
      <div className="flex gap-3 flex-wrap mb-8">
        {['All', ...allTags].map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`font-sans text-xs tracking-wider uppercase px-3 py-1 rounded-full border transition-colors
              ${active === tag
                ? 'border-seafoam bg-seafoam/10 text-seafoam'
                : 'border-gray-200 text-gray-400 hover:border-seafoam hover:text-seafoam'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map((art, i) => (
          <ArtworkCard key={art.slug} {...art} index={i} />
        ))}
      </div>
    </>
  )
}
