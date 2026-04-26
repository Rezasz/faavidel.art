import { readJSON } from '@/lib/blob'
import { PhotographyIndex } from '@/lib/types'
import SeriesGrid from '@/components/photography/SeriesGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function PhotographyPage() {
  const data = await readJSON<PhotographyIndex>('photography/index.json')
  const series = (data?.series ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Visual Stories</p>
        <h1 className="section-title">Photography</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {series.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No series yet.</p>
      ) : (
        <SeriesGrid series={series} />
      )}
    </main>
  )
}
