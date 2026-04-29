'use client'
import { useEffect, useState } from 'react'
import { HomepageContent } from '@/lib/types'
import BrushButton from '@/components/atmosphere/BrushButton'

const defaults: HomepageContent = {
  heroTitle: 'faavidel',
  heroSubtitle: 'A world of creative work',
  heroButtonText: 'Explore the Gallery',
  featuredArtworkSlugs: [],
  bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing.',
}

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageContent>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/homepage').then(r => r.ok ? r.json() : null).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/content/homepage', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Landing</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Homepage Content</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />
      <div className="bg-white border border-brand-night/10 p-6 flex flex-col gap-4 max-w-xl">
        {[
          { key: 'heroTitle', label: 'Hero Title' },
          { key: 'heroSubtitle', label: 'Hero Subtitle' },
          { key: 'heroButtonText', label: 'Button Text' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">{label}</label>
            <input value={(form as unknown as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
          </div>
        ))}
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Bio Snippet</label>
          <textarea value={form.bioSnippet} onChange={e => setForm(f => ({ ...f, bioSnippet: e.target.value }))} rows={3}
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full resize-none" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">
            Featured Artwork Slugs (comma separated)
          </label>
          <input
            placeholder="slug-one, slug-two, slug-three"
            value={form.featuredArtworkSlugs.join(', ')}
            onChange={e => setForm(f => ({
              ...f,
              featuredArtworkSlugs: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full"
          />
        </div>
        <div className="mt-2">
          <BrushButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
          </BrushButton>
        </div>
      </div>
    </div>
  )
}
