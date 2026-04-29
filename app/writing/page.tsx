import { readJSON } from '@/lib/blob'
import { PostIndex } from '@/lib/types'
import PostList from '@/components/writing/PostList'

export const revalidate = 60

export default async function WritingPage() {
  const data = await readJSON<PostIndex>('writing/index.json')
  const posts = (data?.posts ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-3xl mx-auto">
      <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Words</p>
      <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Writing</h1>
      <div className="w-12 h-px bg-brand-amber/60 mt-3 mb-10" />
      {posts.length === 0 ? (
        <p className="font-serif italic text-brand-cream/60 text-lg">No posts yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  )
}
