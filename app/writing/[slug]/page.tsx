import { readJSON } from '@/lib/blob'
import { Post } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const revalidate = 60

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await readJSON<Post>(`writing/${slug}.json`)
  if (!post || post.status === 'draft') notFound()

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/writing" className="font-mono text-[11px] tracking-widest uppercase text-brand-cream/65 hover:text-brand-amber transition-colors inline-block">
          ← All writing
        </Link>
      </div>
      <article className="relative bg-brand-parchment/95 max-w-[65ch] mx-auto p-10 md:p-14 shadow-2xl">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-night/60">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-serif italic text-4xl text-brand-night mt-3 leading-tight">{post.title}</h1>
        <PaintedDivider color="#6B5BA8" width="100px" className="!my-6" />
        <div className="font-serif text-brand-night/90 text-lg leading-relaxed [&>p]:mb-5 [&>h2]:font-serif [&>h2]:italic [&>h2]:text-brand-iris [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
