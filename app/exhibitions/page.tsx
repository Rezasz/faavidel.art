import data from '@/scripts/exhibitions-data.json'
import { Exhibition } from '@/lib/types'
import { slugify } from '@/lib/slug'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Exhibitions · faavidel' }

export default function ExhibitionsPage() {
  const exhibitions = (data as Exhibition[]).slice().sort((a, b) => b.order - a.order)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-5xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">
          Selected exhibitions
        </p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Exhibitions</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      <div className="flex flex-col gap-10">
        {exhibitions.map((e) => {
          const slug = slugify(e.title)
          return (
            <article key={e.order} className="reading-panel p-6 md:p-8">
              <div className="grid md:grid-cols-[2fr_3fr] gap-6 md:gap-8">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-brand-night">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/exhibitions/${slug}.jpg`}
                    alt={`${e.title} — ${e.venue}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/60">
                    {e.dateLabel} · {e.role}
                  </p>
                  <h2 className="font-serif italic text-brand-cream text-2xl md:text-3xl mt-1">
                    {e.title}
                  </h2>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80 mt-2">
                    {e.venue} · {e.city}{e.country ? `, ${e.country}` : ''}
                  </p>
                  <PaintedDivider color="#E8B86F" width="60px" className="!my-4" />
                  <p className="font-serif text-brand-cream/85 leading-relaxed">{e.description}</p>
                  {e.organizer && (
                    <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-4">
                      Curated by {e.organizer}
                    </p>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
