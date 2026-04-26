'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PostIndex } from '@/lib/types'

export default function PostList({ posts }: { posts: PostIndex['posts'] }) {
  const published = posts.filter(p => p.status === 'published')
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {published.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
        >
          <Link href={`/writing/${post.slug}`} className="group flex justify-between items-center py-6">
            <div>
              <h2 className="font-serif text-xl text-charcoal group-hover:text-ocean transition-colors mb-1">
                {post.title}
              </h2>
              <p className="font-sans text-sm text-charcoal/60 mb-2 line-clamp-1">{post.excerpt}</p>
              <p className="font-sans text-xs tracking-wider text-seafoam">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className="text-burnt group-hover:translate-x-1.5 transition-transform text-xl ml-6 shrink-0">→</span>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
