import { readJSON } from '@/lib/blob'
import { PhotoSeriesDetail } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PhotoLightbox from '@/components/photography/PhotoLightbox'

export const revalidate = 60

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>
}) {
  const { series: slug } = await params
  const data = await readJSON<PhotoSeriesDetail>(`photography/${slug}/index.json`)
  if (!data) notFound()

  const photos = (data.photos ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-6xl mx-auto">
      <Link href="/photography" className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65 hover:text-brand-amber transition-colors inline-block mb-8">
        ← All series
      </Link>
      <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Series</p>
      <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">{data.title}</h1>
      <div className="w-12 h-px bg-brand-amber/60 mt-3 mb-6" />
      <p className="font-serif text-brand-cream/85 max-w-2xl mb-10 text-lg leading-relaxed">{data.description}</p>
      <PhotoLightbox photos={photos} />
    </main>
  )
}
