'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Track } from '@/lib/types'
import BleedImage from '@/components/atmosphere/BleedImage'
import { useMusic } from '@/context/MusicContext'

export default function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const current = tracks[currentIdx]
  const { pauseExternal, resumeExternal } = useMusic()

  useEffect(() => {
    pauseExternal()
    return () => { resumeExternal() }
  }, [pauseExternal, resumeExternal])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const ended = () => {
      if (currentIdx < tracks.length - 1) setCurrentIdx(i => i + 1)
      else setPlaying(false)
    }
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('ended', ended)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('ended', ended)
    }
  }, [currentIdx, tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    audio.src = current.fileUrl
    if (playing) audio.play().catch(() => {})
  }, [currentIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().catch(() => {}); setPlaying(true) }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  if (!current) return null

  const isYoutube = !!current.youtubeUrl
  const youtubeEmbed = isYoutube ? (() => {
    try {
      const url = new URL(current.youtubeUrl!)
      if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${url.searchParams.get('v')}?autoplay=0`
      }
      if (url.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${url.pathname}?autoplay=0`
      }
    } catch {}
    return current.youtubeUrl!
  })() : ''

  return (
    <div>
      {isYoutube ? (
        <div className="bg-brand-night/40 backdrop-blur p-6 mb-10 border border-brand-cream/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-14 h-14 overflow-hidden shrink-0">
              {current.artworkUrl && (
                <BleedImage fill src={current.artworkUrl} alt={current.title} sizes="56px" />
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">Now playing</p>
              <h3 className="font-serif italic text-brand-cream text-xl mt-0.5">{current.title}</h3>
              {current.duration && <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55 mt-1">{current.duration}</p>}
            </div>
          </div>
          <div className="overflow-hidden aspect-video">
            <iframe
              src={youtubeEmbed}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="bg-brand-night/40 backdrop-blur p-6 mb-10 border border-brand-cream/10 flex gap-6 items-center">
          <div className="relative w-16 h-16 overflow-hidden shrink-0">
            {current.artworkUrl && (
              <BleedImage fill src={current.artworkUrl} alt={current.title} sizes="64px" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-cream/55">Now playing</p>
            <h3 className="font-serif italic text-brand-cream text-xl truncate">{current.title}</h3>
            <div className="h-px bg-brand-cream/20 mt-3 cursor-pointer" onClick={seek}>
              <motion.div className="h-full bg-brand-amber" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} className="text-brand-cream/60 hover:text-brand-amber transition-colors">
              <SkipBack size={20} />
            </button>
            <button onClick={toggle} className="w-10 h-10 bg-brand-amber text-brand-night flex items-center justify-center hover:bg-brand-coral transition-colors">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={() => setCurrentIdx(i => Math.min(tracks.length - 1, i + 1))} className="text-brand-cream/60 hover:text-brand-amber transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} />

      <div className="flex flex-col">
        {tracks.map((track, i) => (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { setCurrentIdx(i); setPlaying(true) }}
            className={`flex items-center gap-4 py-4 text-left px-2 transition-colors border-b border-brand-cream/10
              ${currentIdx === i ? 'text-brand-amber' : 'text-brand-cream/85 hover:text-brand-cream'}`}
          >
            <span className="font-mono text-[10px] tracking-widest w-6 text-center text-brand-cream/40">{String(i + 1).padStart(2, '0')}</span>
            <div className="relative w-10 h-10 overflow-hidden shrink-0">
              {track.artworkUrl && <BleedImage fill src={track.artworkUrl} alt={track.title} sizes="40px" />}
            </div>
            <span className={`flex-1 truncate ${currentIdx === i ? 'font-serif italic text-lg' : 'font-serif text-base'}`}>{track.title}</span>
            <span className="font-mono text-[10px] tracking-widest text-brand-cream/40">{track.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
