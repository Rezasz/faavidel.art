'use client'
import { useEffect, useState } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 600)
    return () => clearTimeout(t)
  }, [])
  if (hidden) return null
  return (
    <div className="fixed inset-0 z-[80] bg-brand-night flex items-center justify-center">
      <p className="font-serif italic text-brand-cream text-2xl">faavidel</p>
    </div>
  )
}
