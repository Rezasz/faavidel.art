'use client'
import { useEffect, useState } from 'react'
import { SiteSettings } from '@/lib/types'

const defaults: SiteSettings = { siteTitle: 'faavidel.art', siteDescription: '', contactEmail: '', metaImage: '' }

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/site').then(r => r.ok ? r.json() : null).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/content/site', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        {[
          { key: 'siteTitle', label: 'Site Title', type: 'text' },
          { key: 'siteDescription', label: 'Meta Description', type: 'text' },
          { key: 'contactEmail', label: 'Contact Email', type: 'email' },
          { key: 'metaImage', label: 'Default Meta Image URL', type: 'text' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">{label}</label>
            <input value={(form as unknown as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              type={type}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
          </div>
        ))}
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
