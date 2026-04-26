'use client'
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 })
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hovering = !!(target.closest('a, button, [data-cursor-hover]'))
      if (dotRef.current) {
        dotRef.current.style.transform = hovering ? 'scale(2.5)' : 'scale(1)'
        dotRef.current.style.background = hovering ? '#A63D40' : '#5FA8A9'
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cursorX, cursorY])

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    const move = (e: MouseEvent) => {
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-seafoam pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="fixed w-1.5 h-1.5 rounded-full bg-seafoam pointer-events-none z-[9999] transition-all duration-150"
        style={{ transform: 'translate(-50%, -50%)', top: 0, left: 0 }}
      />
    </>
  )
}
