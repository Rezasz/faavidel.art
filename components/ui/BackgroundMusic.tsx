'use client'
import { useMusic } from '@/context/MusicContext'

export default function BackgroundMusic() {
  const { playing, toggle } = useMusic()
  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
      className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase rounded-full backdrop-blur transition-colors
        ${playing
          ? 'bg-brand-amber/90 text-brand-night hover:bg-brand-amber'
          : 'bg-brand-night/60 text-brand-cream/80 hover:bg-brand-night/80 border border-brand-cream/20'}
      `}
      style={{ minWidth: 44, minHeight: 44 }}
    >
      <span aria-hidden className="mr-1.5">♪</span>
      {playing ? 'Music' : 'Muted'}
    </button>
  )
}
