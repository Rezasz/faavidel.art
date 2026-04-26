import { readJSON } from '@/lib/blob'
import { GalleryIndex } from '@/lib/types'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function GalleryPage() {
  const data = await readJSON<GalleryIndex>('gallery/index.json')
  const artworks = (data?.artworks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="section-label">All Work</p>
        <h1 className="section-title">Gallery</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {artworks.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No artwork yet.</p>
      ) : (
        <GalleryGrid artworks={artworks} />
      )}
    </main>
  )
}
