'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Track } from '@/lib/types'
import Image from 'next/image'

export default function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const current = tracks[currentIdx]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const ended = () => {
      if (currentIdx < tracks.length - 1) {
        setCurrentIdx(i => i + 1)
      } else {
        setPlaying(false)
      }
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

  return (
    <div>
      <div className="bg-ocean rounded-xl p-6 mb-8 flex gap-6 items-center">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal shrink-0 relative">
          {current.artworkUrl && (
            <Image src={current.artworkUrl} alt={current.title} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-serif text-lg truncate">{current.title}</h3>
          <div className="h-1 bg-white/20 rounded-full mt-3 cursor-pointer" onClick={seek}>
            <motion.div className="h-full bg-burnt rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button onClick={toggle} className="w-10 h-10 bg-burnt rounded-full flex items-center justify-center text-white hover:bg-burnt/80 transition-colors">
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setCurrentIdx(i => Math.min(tracks.length - 1, i + 1))} className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <audio ref={audioRef} />

      <div className="flex flex-col divide-y divide-gray-100">
        {tracks.map((track, i) => (
          <motion.button
            key={track.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { setCurrentIdx(i); setPlaying(true) }}
            className={`flex items-center gap-4 py-4 text-left hover:bg-off-white rounded px-2 transition-colors
              ${currentIdx === i ? 'text-ocean' : 'text-charcoal'}`}
          >
            <span className="font-sans text-xs w-6 text-center text-charcoal/40">{i + 1}</span>
            <div className="w-10 h-10 rounded bg-off-white-2 relative overflow-hidden shrink-0">
              {track.artworkUrl && (
                <Image src={track.artworkUrl} alt={track.title} fill className="object-cover" />
              )}
            </div>
            <span className="font-serif flex-1 truncate">{track.title}</span>
            <span className="font-sans text-xs text-charcoal/40">{track.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
