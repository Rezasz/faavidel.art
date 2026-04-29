'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PostIndex } from '@/lib/types'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export default function PostList({ posts }: { posts: PostIndex['posts'] }) {
  const published = posts.filter(p => p.status === 'published')
  return (
    <div className="flex flex-col">
      {published.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        >
          <article className="py-8">
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/60">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="font-serif italic text-3xl text-brand-cream mt-2">
              <Link href={`/writing/${post.slug}`} className="hover:text-brand-amber transition-colors">{post.title}</Link>
            </h2>
            <p className="font-serif text-brand-cream/80 mt-3 max-w-2xl">{post.excerpt}</p>
          </article>
          {i < published.length - 1 && <PaintedDivider />}
        </motion.div>
      ))}
    </div>
  )
}
