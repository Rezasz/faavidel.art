import { readJSON } from '@/lib/blob'
import { Artwork } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BleedImage from '@/components/atmosphere/BleedImage'
import RingedOrb from '@/components/atmosphere/RingedOrb'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const revalidate = 60

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artwork = await readJSON<Artwork>(`gallery/${slug}.json`)
  if (!artwork) notFound()

  return (
    <main className="relative">
      <section className="relative w-full h-screen">
        <BleedImage fill src={artwork.imageUrl} alt={artwork.title} priority sizes="100vw" />
        <RingedOrb size={48} className="absolute top-[14%] right-[10%]" />
      </section>

      <section className="relative max-w-3xl mx-auto px-6 md:px-12 py-20">
        <Link href="/gallery" className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65 hover:text-brand-amber transition-colors inline-block mb-8">
          ← Back to paintings
        </Link>
        <div className="reading-panel p-8 md:p-12 text-brand-cream">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65">{artwork.year}</p>
          <h1 className="font-serif italic text-4xl md:text-5xl mt-3">{artwork.title}</h1>
          <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
          <p className="font-serif text-brand-cream/85 text-lg leading-relaxed">{artwork.description}</p>
          <div className="mt-6 flex gap-4 flex-wrap font-mono text-[10px] uppercase tracking-widest text-brand-cream/55">
            {artwork.tags.map(t => <span key={t}>#{t}</span>)}
          </div>
        </div>
      </section>
    </main>
  )
}
