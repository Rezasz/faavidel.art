import seed from '@/scripts/exhibitions-data.json'
import { Exhibition, ExhibitionsIndex } from '@/lib/types'
import { readJSON } from '@/lib/blob'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Exhibitions · faavidel' }
export const revalidate = 60

const photoSrc = (img: string) =>
  !img ? '' : img.startsWith('http') ? img : `/exhibitions/${img}`

export default async function ExhibitionsPage() {
  const stored = await readJSON<ExhibitionsIndex>('exhibitions/index.json')
  const exhibitions = stored?.exhibitions?.length ? stored.exhibitions : (seed as Exhibition[])
  const years = Array.from(new Set(exhibitions.map(e => e.year))).sort((a, b) => b - a)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-5xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-12 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Selected exhibitions</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Exhibitions</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      {years.map((year) => {
        const items = exhibitions
          .filter(e => e.year === year)
          .sort((a, b) => a.order - b.order)
        return (
          <section key={year} className="mb-16">
            <h2 className="font-serif italic text-brand-cream/80 text-3xl md:text-4xl mb-6">{year}</h2>
            <div className="flex flex-col gap-8">
              {items.map((e) => (
                <article key={`${e.year}-${e.order}`} className="reading-panel p-5 md:p-7">
                  <div className="grid md:grid-cols-[2fr_3fr] gap-5 md:gap-7">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-brand-night">
                      {e.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoSrc(e.image)}
                          alt={`${e.title} — ${e.venue}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/60">
                        {e.dateLabel}
                      </p>
                      <h3 className="font-serif italic text-brand-cream text-xl md:text-2xl mt-1">
                        {e.title}
                      </h3>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-amber/80 mt-2">
                        {e.venue}
                        {e.city || e.country ? ' · ' : ''}
                        {[e.city, e.country].filter(Boolean).join(', ')}
                      </p>
                      <PaintedDivider color="#E8B86F" width="50px" className="!my-3" />
                      <dl className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/65 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                        <dt className="text-brand-cream/45">Format</dt>
                        <dd>{e.format}</dd>
                        {e.curator && (
                          <>
                            <dt className="text-brand-cream/45">Curated by</dt>
                            <dd>{e.curator}</dd>
                          </>
                        )}
                        {e.link && (
                          <>
                            <dt className="text-brand-cream/45">Link</dt>
                            <dd>
                              <a
                                href={e.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-amber hover:text-brand-cream border-b border-brand-amber/40 pb-0.5 transition-colors"
                              >
                                {e.link.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                              </a>
                            </dd>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
