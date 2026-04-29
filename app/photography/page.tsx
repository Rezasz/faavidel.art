import { readJSON } from '@/lib/blob'
import { PhotographyIndex } from '@/lib/types'
import SeriesGrid from '@/components/photography/SeriesGrid'

export const revalidate = 60

export default async function PhotographyPage() {
  const data = await readJSON<PhotographyIndex>('photography/index.json')
  const series = (data?.series ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-6xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Visual stories</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Photography</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>
      {series.length === 0 ? (
        <div className="reading-panel p-8 inline-block"><p className="font-serif italic text-brand-cream/60 text-lg">No series yet.</p></div>
      ) : (
        <SeriesGrid series={series} />
      )}
    </main>
  )
}
