import { readJSON } from '@/lib/blob'
import { GalleryIndex } from '@/lib/types'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export const revalidate = 60

export default async function GalleryPage() {
  const data = await readJSON<GalleryIndex>('gallery/index.json')
  const artworks = (data?.artworks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-6xl mx-auto">
      <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">All work</p>
      <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Paintings</h1>
      <div className="w-12 h-px bg-brand-amber/60 mt-3 mb-10" />
      {artworks.length === 0 ? (
        <p className="font-serif italic text-brand-cream/60 text-lg">No artwork yet.</p>
      ) : (
        <GalleryGrid artworks={artworks} />
      )}
    </main>
  )
}
