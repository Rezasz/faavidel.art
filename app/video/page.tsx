import Link from 'next/link'
import PaintedDivider from '@/components/atmosphere/PaintedDivider'

export const metadata = { title: 'Video · faavidel' }

export default function VideoPage() {
  return (
    <main className="relative min-h-screen px-6 md:px-12 py-24 max-w-3xl mx-auto">
      <div className="reading-panel p-6 md:p-10 mb-10 inline-block">
        <p className="font-mono text-[11px] tracking-widest uppercase text-brand-amber/80">Moving image</p>
        <h1 className="font-serif italic text-brand-cream text-4xl md:text-5xl mt-2">Video</h1>
        <div className="w-12 h-px bg-brand-amber/60 mt-3" />
      </div>

      <div className="reading-panel p-8 md:p-12">
        <p className="font-serif text-brand-cream/85 text-lg leading-relaxed">
          Faavidel’s video work — animations, motion paintings, ambient short films — lives on her YouTube channel. New pieces appear there first.
        </p>
        <PaintedDivider color="#E8B86F" width="100px" className="!my-6" />
        <Link
          href="https://www.youtube.com/@Faavidel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase text-brand-night bg-brand-amber px-7 py-3 hover:bg-brand-coral transition-colors"
        >
          Watch on YouTube ↗
        </Link>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-4">youtube.com/@Faavidel</p>
      </div>
    </main>
  )
}
