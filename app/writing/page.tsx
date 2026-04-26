import { readJSON } from '@/lib/blob'
import { PostIndex } from '@/lib/types'
import PostList from '@/components/writing/PostList'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function WritingPage() {
  const data = await readJSON<PostIndex>('writing/index.json')
  const posts = (data?.posts ?? []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="min-h-screen py-20 px-8 max-w-3xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Words</p>
        <h1 className="section-title">Writing</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {posts.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No posts yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  )
}
