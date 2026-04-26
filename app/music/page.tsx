import { readJSON } from '@/lib/blob'
import { MusicIndex } from '@/lib/types'
import AudioPlayer from '@/components/music/AudioPlayer'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function MusicPage() {
  const data = await readJSON<MusicIndex>('music/index.json')
  const tracks = (data?.tracks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen py-20 px-8 max-w-3xl mx-auto">
      <AnimatedSection>
        <p className="section-label">Sound</p>
        <h1 className="section-title">Music</h1>
        <div className="section-rule" />
      </AnimatedSection>
      {tracks.length === 0 ? (
        <p className="font-serif text-gray-400 text-lg">No tracks yet.</p>
      ) : (
        <AudioPlayer tracks={tracks} />
      )}
    </main>
  )
}
