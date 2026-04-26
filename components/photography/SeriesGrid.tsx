import Link from 'next/link'
import Image from 'next/image'
import { PhotographyIndex } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function SeriesGrid({ series }: { series: PhotographyIndex['series'] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {series.map((s, i) => (
        <AnimatedSection key={s.slug} delay={i * 0.08}>
          <Link href={`/photography/${s.slug}`} className="group block" data-cursor-hover>
            <div className="aspect-square overflow-hidden rounded bg-off-white relative">
              <Image src={s.coverUrl} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/50 transition-colors duration-300 flex items-end p-5">
                <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{s.title}</span>
              </div>
            </div>
            <h3 className="font-serif text-base text-charcoal group-hover:text-ocean transition-colors mt-3">{s.title}</h3>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  )
}
