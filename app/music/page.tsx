import { readJSON } from '@/lib/blob'
import { MusicIndex } from '@/lib/types'
import AudioPlayer from '@/components/music/AudioPlayer'

export const revalidate = 60

export default async function MusicPage() {
  const data = await readJSON<MusicIndex>('music/index.json')
  const tracks = (data?.tracks ?? []).sort((a, b) => a.order - b.order)

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-3xl mx-auto">
      <div className="reading-panel p-8 md:p-12">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Sound</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Music</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3 mb-10" />
        {tracks.length === 0 ? (
          <p className="font-serif italic text-brand-cream/60 text-lg">No tracks yet.</p>
        ) : (
          <AudioPlayer tracks={tracks} />
        )}
      </div>
    </main>
  )
}
