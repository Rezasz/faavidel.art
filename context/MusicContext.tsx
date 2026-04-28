'use client'
import { createContext, useContext, useEffect, useReducer, useRef, useCallback, ReactNode } from 'react'

type State = { playing: boolean }
type Action =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  | { type: 'hydrate'; playing: boolean }

export const initialMusicState = (): State => ({ playing: false })

export function reduceMusicState(s: State, a: Action): State {
  switch (a.type) {
    case 'play':    return { playing: true }
    case 'pause':   return { playing: false }
    case 'toggle':  return { playing: !s.playing }
    case 'hydrate': return { playing: a.playing }
  }
}

interface MusicContextValue {
  playing: boolean
  toggle: () => void
  pauseExternal: () => void   // used by /music page
  resumeExternal: () => void
}

const Ctx = createContext<MusicContextValue | null>(null)
const STORAGE_KEY = 'faavidel.music'
const VOLUME = 0.35
const FADE_MS = 800

export function MusicProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceMusicState, undefined, initialMusicState)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const externalPaused = useRef(false)

  // hydrate from localStorage
  useEffect(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (v === 'on') dispatch({ type: 'hydrate', playing: true })
  }, [])

  // persist
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, state.playing ? 'on' : 'off')
  }, [state.playing])

  // mount audio element once
  useEffect(() => {
    const a = new Audio('/audio/ambient.mp3')
    a.loop = true
    a.preload = 'auto'
    a.volume = 0
    audioRef.current = a
    return () => { a.pause(); a.src = '' }
  }, [])

  // play/pause + fade
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    let raf = 0, start = 0
    const target = state.playing && !externalPaused.current ? VOLUME : 0
    const from = a.volume
    const animate = (t: number) => {
      if (!start) start = t
      const k = Math.min(1, (t - start) / FADE_MS)
      a.volume = from + (target - from) * k
      if (k < 1) raf = requestAnimationFrame(animate)
      else if (target === 0) a.pause()
    }
    if (target > 0 && a.paused) {
      a.play().catch(() => {/* autoplay blocked — keep state, user must retry */})
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [state.playing])

  const toggle = useCallback(() => dispatch({ type: 'toggle' }), [])
  const pauseExternal = useCallback(() => {
    externalPaused.current = true
    audioRef.current?.pause()
  }, [])
  const resumeExternal = useCallback(() => {
    externalPaused.current = false
    if (state.playing) audioRef.current?.play().catch(() => {})
  }, [state.playing])

  return (
    <Ctx.Provider value={{ playing: state.playing, toggle, pauseExternal, resumeExternal }}>
      {children}
    </Ctx.Provider>
  )
}

export function useMusic() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useMusic must be inside <MusicProvider>')
  return v
}
