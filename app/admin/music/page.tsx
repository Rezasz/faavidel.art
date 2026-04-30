'use client'
import { useEffect, useState } from 'react'
import { MusicSettings } from '@/lib/types'
import BrushButton from '@/components/atmosphere/BrushButton'

const inputCls = 'bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full'

export default function AdminMusicPage() {
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const r = await fetch('/api/content/music/soundcloud')
    if (r.ok) {
      const d: MusicSettings | null = await r.json()
      setUrl(d?.soundcloudUrl ?? '')
    }
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/content/music/soundcloud', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ soundcloudUrl: url.trim() } satisfies MusicSettings),
      })
      await load()
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Sound</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Music · SoundCloud</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />
      <p className="font-serif text-brand-night/70 max-w-2xl mb-6">
        The public music page embeds whatever SoundCloud URL you save here — a track, set, or your full profile. Paste any soundcloud.com URL and save.
      </p>

      <div className="bg-white border border-brand-night/10 p-5 max-w-xl flex flex-col gap-4">
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">SoundCloud URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} className={inputCls} placeholder="https://soundcloud.com/faavidel" />
        </div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">
          Examples: https://soundcloud.com/faavidel · https://soundcloud.com/faavidel/sets/feverish-delusion
        </p>
        <div>
          <BrushButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save URL'}
          </BrushButton>
        </div>
      </div>
    </div>
  )
}
