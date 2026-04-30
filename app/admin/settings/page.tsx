'use client'
import { useEffect, useState } from 'react'
import { SiteSettings } from '@/lib/types'
import BrushButton from '@/components/atmosphere/BrushButton'

const defaults: SiteSettings = { siteTitle: 'faavidel.art', siteDescription: '', contactEmail: '', metaImage: '' }

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const r = await fetch('/api/content/site')
    if (r.ok) {
      const d = await r.json()
      if (d) setForm({ ...defaults, ...d })
    }
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/content/site', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
      })
      await load()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Configuration</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Settings</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />
      <div className="bg-white border border-brand-night/10 p-6 flex flex-col gap-4 max-w-xl">
        {[
          { key: 'siteTitle', label: 'Site Title', type: 'text' },
          { key: 'siteDescription', label: 'Meta Description', type: 'text' },
          { key: 'contactEmail', label: 'Contact Email', type: 'email' },
          { key: 'metaImage', label: 'Default Meta Image URL', type: 'text' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">{label}</label>
            <input value={(form as unknown as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              type={type}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
          </div>
        ))}
        <div className="mt-2">
          <BrushButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
          </BrushButton>
        </div>
      </div>
    </div>
  )
}
