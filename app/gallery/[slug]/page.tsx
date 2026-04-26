import { readJSON } from '@/lib/blob'
import { Artwork } from '@/lib/types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'

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
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <Link href="/gallery" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean transition-colors mb-8 inline-block">
          ← Back to Gallery
        </Link>
      </AnimatedSection>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <AnimatedSection>
          <div className="relative aspect-[4/3] rounded overflow-hidden bg-off-white">
            <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15} direction="left">
          <p className="section-label">{artwork.year}</p>
          <h1 className="section-title mt-1">{artwork.title}</h1>
          <div className="section-rule" />
          <p className="font-serif text-charcoal/80 leading-relaxed mb-6">{artwork.description}</p>
          <div className="flex gap-2 flex-wrap">
            {artwork.tags.map(t => (
              <span key={t} className="font-sans text-xs tracking-wider uppercase text-seafoam border border-seafoam/30 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
