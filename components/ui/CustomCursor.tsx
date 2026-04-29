'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const c = canvasRef.current!
    const d = dotRef.current!
    const ctx = c.getContext('2d')!
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      c.style.width = window.innerWidth + 'px'
      c.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const trail: { x: number; y: number; t: number }[] = []
    let mx = 0, my = 0, hovering = false
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      trail.push({ x: mx, y: my, t: performance.now() })
      if (trail.length > 40) trail.shift()
      const t = e.target as HTMLElement | null
      hovering = !!t?.closest('a, button')
    }
    window.addEventListener('mousemove', move)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, c.width / dpr, c.height / dpr)
      const now = performance.now()
      ctx.lineCap = 'round'
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i]
        const age = (now - b.t) / 800
        if (age >= 1) continue
        ctx.strokeStyle = `rgba(232,184,111,${0.85 * (1 - age)})`
        ctx.lineWidth = 3 * (1 - age) + 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      d.style.transform = `translate(${mx}px, ${my}px) scale(${hovering ? 2.8 : 1})`
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-[60] pointer-events-none" />
      <div
        ref={dotRef}
        aria-hidden
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-brand-amber pointer-events-none z-[61] mix-blend-difference transition-transform duration-150"
        style={{
          marginLeft: -8,
          marginTop: -8,
          willChange: 'transform',
          boxShadow: '0 0 12px rgba(232,184,111,0.9), 0 0 24px rgba(232,184,111,0.5)',
        }}
      />
    </>
  )
}
