import { readJSON } from '@/lib/blob'
import { MusicSettings } from '@/lib/types'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const revalidate = 86400
export const metadata = { title: 'Music · faavidel' }

const DEFAULT_SOUNDCLOUD_URL = 'https://soundcloud.com/faavidel'

export default async function MusicPage() {
  const settings = await readJSON<MusicSettings>('music/soundcloud.json')
  const url = settings?.soundcloudUrl?.trim() || DEFAULT_SOUNDCLOUD_URL
  const embedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23E8B86F&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-3xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Sound</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Music</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      <div className="reading-panel p-6 md:p-8">
        <p className="font-serif text-brand-cream/85 text-lg leading-relaxed mb-6">
          Faavidel&apos;s music — original compositions for installation, video and ambient listening — lives on SoundCloud.
        </p>
        <div className="overflow-hidden rounded-sm">
          <iframe
            title="Faavidel on SoundCloud"
            width="100%"
            height="450"
            allow="autoplay"
            scrolling="no"
            frameBorder="0"
            src={embedSrc}
          />
        </div>
        <PaintedDivider color="#E8B86F" width="100px" className="!my-6" />
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
        </p>
      </div>
    </main>
  )
}
