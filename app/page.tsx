import { readJSON } from '@/lib/blob'
import { HomepageContent, GalleryIndex, PostIndex } from '@/lib/types'
import Link from 'next/link'
import BleedImage from '@/components/atmosphere/BleedImage'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'
import BrushButton from '@/components/atmosphere/BrushButton'

const defaultHomepage: HomepageContent = {
  heroTitle: 'painting is a way of breathing in another world.',
  heroSubtitle: 'Multidisciplinary work by Faezeh Ghavidel — paintings, photography, writing, video and music.',
  heroButtonText: 'Enter the gallery',
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
    <main className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 md:px-16">
        <div className="relative z-10 max-w-3xl">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/75 mb-4">
            Faezeh Ghavidel · Multidisciplinary artist
          </p>
          <h1 className="font-serif italic text-brand-cream text-4xl md:text-6xl leading-[1.05]">
            {content.heroTitle}
          </h1>
          <PaintedUnderline width={240} className="mt-6" />
          <p className="mt-8 font-serif text-brand-cream/85 text-lg max-w-xl">
            {content.heroSubtitle}
          </p>
          <div className="mt-8">
            <BrushButton href="/gallery">{content.heroButtonText || 'Enter the gallery'}</BrushButton>
          </div>
        </div>
      </section>

      {/* Featured paintings */}
      {artworks.length > 0 && (
        <section className="relative px-6 md:px-16 py-20 max-w-6xl mx-auto">
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Featured</p>
          <h2 className="font-serif italic text-brand-cream text-3xl mt-2">Recent paintings</h2>
          <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <Link key={art.slug} href={`/gallery/${art.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <BleedImage fill src={art.imageUrl} alt={art.title} sizes="(max-width:768px) 50vw, 33vw" />
                </div>
                <h3 className="font-serif italic text-xl text-brand-cream mt-3">{art.title}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <PaintedUnderline width={120} delay={0} />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/gallery" className="font-mono text-[11px] tracking-widest uppercase text-brand-amber hover:text-brand-cream transition-colors">
              View all paintings →
            </Link>
          </div>
        </section>
      )}

      {/* Words */}
      {latestPosts.length > 0 && (
        <section className="relative px-6 md:px-16 py-20 max-w-3xl mx-auto">
          <PaintedDivider />
          <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80 mt-6">Words</p>
          <h2 className="font-serif italic text-brand-cream text-3xl mt-2">Writing</h2>
          <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
          <div className="flex flex-col">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/writing/${post.slug}`} className="group flex justify-between items-baseline py-5 border-b border-brand-cream/10">
                <div>
                  <h3 className="font-serif italic text-xl text-brand-cream group-hover:text-brand-amber transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-1">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
                <span aria-hidden className="font-mono text-brand-amber group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="relative px-6 md:px-16 py-20 max-w-3xl mx-auto text-center">
        <PaintedDivider />
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80 mt-6">The artist</p>
        <h2 className="font-serif italic text-brand-cream text-3xl mt-2">About Faavidel</h2>
        <PaintedDivider color="#E8B86F" width="120px" className="!my-6" />
        <p className="font-serif text-brand-cream/85 leading-relaxed text-lg mb-8">
          {content.bioSnippet}
        </p>
        <BrushButton href="/about">Read more</BrushButton>
      </section>
    </main>
  )
}
