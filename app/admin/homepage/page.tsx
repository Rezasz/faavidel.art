'use client'
import { useEffect, useState } from 'react'
import { HomepageContent } from '@/lib/types'

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
      <h1 className="font-serif text-2xl text-charcoal mb-6">Homepage Content</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        {[
          { key: 'heroTitle', label: 'Hero Title' },
          { key: 'heroSubtitle', label: 'Hero Subtitle' },
          { key: 'heroButtonText', label: 'Button Text' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">{label}</label>
            <input value={(form as unknown as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
          </div>
        ))}
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Bio Snippet</label>
          <textarea value={form.bioSnippet} onChange={e => setForm(f => ({ ...f, bioSnippet: e.target.value }))} rows={3}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam resize-none" />
        </div>
        <div>
          <label className="font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-1.5 block">
            Featured Artwork Slugs (comma separated)
          </label>
          <input
            placeholder="slug-one, slug-two, slug-three"
            value={form.featuredArtworkSlugs.join(', ')}
            onChange={e => setForm(f => ({
              ...f,
              featuredArtworkSlugs: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="w-full border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam transition-colors"
          />
        </div>
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
