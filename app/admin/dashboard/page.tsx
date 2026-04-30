import { readJSON } from '@/lib/blob'
import { GalleryIndex, PostIndex, ExhibitionsIndex, Exhibition } from '@/lib/types'
import seed from '@/scripts/exhibitions-data.json'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  const [gallery, posts, exhibitions] = await Promise.all([
    readJSON<GalleryIndex>('gallery/index.json'),
    readJSON<PostIndex>('writing/index.json'),
    readJSON<ExhibitionsIndex>('exhibitions/index.json'),
  ])

  const exhibitionCount = exhibitions?.exhibitions?.length ?? (seed as Exhibition[]).length

  const stats = [
    { label: 'Artworks', value: gallery?.artworks.length ?? 0, href: '/admin/gallery' },
    { label: 'Exhibitions', value: exhibitionCount, href: '/admin/exhibitions' },
    { label: 'Posts', value: posts?.posts.filter(p => p.status === 'published').length ?? 0, href: '/admin/writing' },
  ]

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Overview</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Dashboard</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white p-5 border border-brand-night/10 hover:border-brand-iris transition-colors">
            <p className="font-serif text-3xl text-brand-iris mb-1">{s.value}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
