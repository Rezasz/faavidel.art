import { readJSON } from '@/lib/blob'
import { Post } from '@/lib/types'
import { notFound } from 'next/navigation'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

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
    <main className="min-h-screen py-20 px-8 max-w-2xl mx-auto">
      <AnimatedSection>
        <Link href="/writing" className="font-sans text-xs tracking-wider uppercase text-seafoam hover:text-ocean mb-8 inline-block">
          ← All Writing
        </Link>
        <p className="font-sans text-xs tracking-wider text-seafoam mb-3">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-serif text-4xl text-charcoal leading-tight mb-2">{post.title}</h1>
        <div className="w-8 h-0.5 bg-burnt my-6" />
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <div className="font-serif text-charcoal/85 leading-relaxed [&>p]:mb-5 [&>h2]:text-ocean [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </AnimatedSection>
    </main>
  )
}
