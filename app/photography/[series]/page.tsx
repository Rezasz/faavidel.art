import { readJSON } from '@/lib/blob'
import { PhotoSeriesDetail } from '@/lib/types'
import { notFound } from 'next/navigation'
import PhotoLightbox from '@/components/photography/PhotoLightbox'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

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
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <Link href="/photography" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">
          ← All Series
        </Link>
        <p className="section-label">Series</p>
        <h1 className="section-title">{data.title}</h1>
        <div className="section-rule" />
        <p className="font-serif text-charcoal/70 max-w-2xl mb-10">{data.description}</p>
      </AnimatedSection>
      <PhotoLightbox photos={photos} />
    </main>
  )
}
