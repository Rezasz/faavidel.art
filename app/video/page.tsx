import Link from 'next/link'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Video · faavidel' }
export const revalidate = 3600 // refresh the feed once an hour

const CHANNEL_ID = 'UCTrofi53ugKi0u0FFhanACw'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const CHANNEL_URL = 'https://www.youtube.com/@Faavidel'

interface YTVideo {
  id: string
  title: string
  published: string
}

async function fetchVideos(): Promise<YTVideo[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)
    return entries.map((e) => {
      const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? ''
      const title = (e.match(/<title>([^<]+)<\/title>/)?.[1] ?? '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      const published = e.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
      return { id, title, published }
    }).filter(v => v.id)
  } catch {
    return []
  }
}

export default async function VideoPage() {
  const videos = await fetchVideos()

  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-6xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Moving image</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Video</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      <div className="reading-panel p-6 md:p-8 mb-10">
        <p className="font-serif text-brand-cream/85 text-lg leading-relaxed">
          Faavidel’s video work — animations, motion paintings, ambient short films — lives on her YouTube channel. The latest pieces appear below; the full archive is on YouTube.
        </p>
        <PaintedDivider color="#E8B86F" width="100px" className="!my-6" />
        <Link
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase text-brand-night bg-brand-amber px-7 py-3 hover:bg-brand-coral transition-colors"
        >
          Watch on YouTube ↗
        </Link>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-4">youtube.com/@Faavidel</p>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <Link
              key={v.id}
              href={`${CHANNEL_URL.replace('youtube.com/@Faavidel', 'youtube.com/watch')}?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group reading-panel block p-3 transition-colors hover:bg-brand-night/75"
            >
              <div className="relative aspect-video overflow-hidden rounded-sm bg-brand-night">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-12 h-12 rounded-full bg-brand-night/70 backdrop-blur flex items-center justify-center group-hover:bg-brand-amber transition-colors">
                    <span aria-hidden className="text-brand-cream group-hover:text-brand-night text-xl">▶</span>
                  </span>
                </div>
              </div>
              <h2 className="font-serif italic text-brand-cream text-lg mt-3 line-clamp-2">{v.title}</h2>
              {v.published && (
                <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-1">
                  {new Date(v.published).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="reading-panel p-8 inline-block">
          <p className="font-serif italic text-brand-cream/60 text-lg">
            Couldn’t load the latest videos right now. Try the channel directly.
          </p>
        </div>
      )}
    </main>
  )
}
