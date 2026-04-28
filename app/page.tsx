import { readJSON } from '@/lib/blob'
import { HomepageContent, GalleryIndex, PostIndex } from '@/lib/types'
import HeroSection from '@/components/home/HeroSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import AtmosphericLayer from '@/components/atmosphere/AtmosphericLayer'
import Link from 'next/link'
import Image from 'next/image'

const defaultHomepage: HomepageContent = {
  heroTitle: 'faavidel',
  heroSubtitle: 'A world of creative work',
  heroButtonText: 'Explore the Gallery',
  featuredArtworkSlugs: [],
  bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing.',
}

export const revalidate = 60

export default async function HomePage() {
  const [homepage, gallery, posts] = await Promise.all([
    readJSON<HomepageContent>('homepage.json'),
    readJSON<GalleryIndex>('gallery/index.json'),
    readJSON<PostIndex>('writing/index.json'),
  ])

  const content = homepage ?? defaultHomepage
  const artworks = gallery?.artworks.slice(0, 6) ?? []
  const latestPosts = posts?.posts.filter(p => p.status === 'published').slice(0, 3) ?? []

  return (
    <main>
      <AtmosphericLayer />
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        buttonText={content.heroButtonText}
      />

      {artworks.length > 0 && (
        <section className="py-20 px-8 max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="section-label">Featured Work</p>
            <h2 className="section-title">Gallery</h2>
            <div className="section-rule" />
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artworks.map((art, i) => (
              <AnimatedSection key={art.slug} delay={i * 0.08}>
                <Link href={`/gallery/${art.slug}`} className="group block aspect-[4/3] overflow-hidden rounded relative bg-off-white">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/60 transition-colors duration-300 flex items-end p-4">
                    <span className="text-white font-sans text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {art.title}
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8 text-center">
            <Link href="/gallery" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean transition-colors">
              View all work →
            </Link>
          </AnimatedSection>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="py-20 px-8 bg-off-white-2">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <p className="section-label">Latest</p>
              <h2 className="section-title">Writing</h2>
              <div className="section-rule" />
            </AnimatedSection>
            <div className="flex flex-col divide-y divide-gray-200">
              {latestPosts.map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 0.1} direction="left">
                  <Link href={`/writing/${post.slug}`} className="group flex justify-between items-center py-5">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal group-hover:text-ocean transition-colors">
                        {post.title}
                      </h3>
                      <p className="font-sans text-xs tracking-wider text-seafoam mt-1">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                    <span className="text-burnt group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-ocean py-20 px-8">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <p className="section-label text-seafoam">The Artist</p>
          <h2 className="text-3xl text-white font-serif mt-2 mb-1">About Faavidel</h2>
          <div className="w-8 h-0.5 bg-burnt mx-auto mt-1 mb-7" />
          <p className="text-white/70 font-serif leading-relaxed text-lg mb-8">
            {content.bioSnippet}
          </p>
          <Link
            href="/about"
            className="inline-block border border-seafoam text-seafoam font-sans text-xs tracking-wider uppercase px-6 py-2.5 rounded hover:bg-seafoam hover:text-white transition-colors"
          >
            Read More →
          </Link>
        </AnimatedSection>
      </section>
    </main>
  )
}
