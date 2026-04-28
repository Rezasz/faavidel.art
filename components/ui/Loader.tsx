'use client'
import { useEffect, useState } from 'react'
import RingedOrb from '@/components/atmosphere/RingedOrb'
import PaintedUnderline from '@/components/atmosphere/PaintedUnderline'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1600)
    return () => clearTimeout(t)
  }, [])
  if (hidden) return null
  return (
    <div className="fixed inset-0 z-[80] bg-brand-night flex flex-col items-center justify-center">
      <div className="flex gap-12 mb-6">
        <RingedOrb size={36} rings="solid" delay={0} />
        <RingedOrb size={42} delay={-1} />
        <RingedOrb size={36} rings="dashed" delay={-2} />
      </div>
      <p className="font-serif italic text-brand-cream text-2xl">faavidel</p>
      <PaintedUnderline width={140} delay={0.2} />
    </div>
  )
}
