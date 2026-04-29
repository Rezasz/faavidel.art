import { readJSON } from '@/lib/blob'
import { Artwork, GalleryIndex } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const revalidate = 60

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [artwork, index] = await Promise.all([
    readJSON<Artwork>(`gallery/${slug}.json`),
    readJSON<GalleryIndex>('gallery/index.json'),
  ])
  if (!artwork) notFound()

  const all = (index?.artworks ?? []).slice().sort((a, b) => a.order - b.order)
  const i = all.findIndex(a => a.slug === slug)
  const prev = all.length ? all[(i - 1 + all.length) % all.length] : null
  const next = all.length ? all[(i + 1) % all.length] : null
  const total = all.length || 1
  const position = i >= 0 ? i + 1 : 1

  return (
    <main className="relative min-h-screen px-4 md:px-12 py-20 md:py-24 text-brand-cream">
      {/* Neutral black background — covers the global atmospheric layer for this page only */}
      <div aria-hidden className="fixed inset-0 -z-[5] bg-brand-night" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/gallery" className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65 hover:text-brand-amber transition-colors">
            ← All paintings
          </Link>
          <span className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/50">
            № {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">
          {prev ? (
            <Link
              href={`/gallery/${prev.slug}`}
              aria-label={`Previous: ${prev.title}`}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-cream/10 text-brand-cream hover:bg-brand-amber hover:text-brand-night transition-colors"
            >
              <span aria-hidden className="text-xl leading-none">‹</span>
            </Link>
          ) : <span />}

          <div className="flex items-center justify-center min-h-[60vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-h-[78vh] max-w-full w-auto h-auto object-contain rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            />
          </div>

          {next ? (
            <Link
              href={`/gallery/${next.slug}`}
              aria-label={`Next: ${next.title}`}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-cream/10 text-brand-cream hover:bg-brand-amber hover:text-brand-night transition-colors"
            >
              <span aria-hidden className="text-xl leading-none">›</span>
            </Link>
          ) : <span />}
        </div>

        <div className="mt-10 max-w-3xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65">{artwork.year}</p>
          <h1 className="font-serif italic text-3xl md:text-4xl mt-2">{artwork.title}</h1>
          <PaintedDivider color="#E8B86F" width="100px" className="!my-5" />
          {artwork.description && (
            <p className="font-serif text-brand-cream/85 text-lg leading-relaxed">{artwork.description}</p>
          )}
          {artwork.tags?.length > 0 && (
            <div className="mt-5 flex gap-4 flex-wrap font-mono text-[10px] uppercase tracking-widest text-brand-cream/55">
              {artwork.tags.map(t => <span key={t}>#{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
