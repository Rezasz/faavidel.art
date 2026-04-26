import { readJSON } from '@/lib/blob'
import { VideoIndex } from '@/lib/types'
import VideoGrid from '@/components/video/VideoGrid'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function VideoPage() {
  const data = await readJSON<VideoIndex>('video/index.json')
  const videos = (data?.videos ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-5xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Moving Image</p>
        <h1 className="section-title">Video</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {videos.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No videos yet.</p>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </main>
  )
}
