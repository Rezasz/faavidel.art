'use client'
import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'

const defaults: AboutContent = {
  fullBio: '',
  profilePhotoUrl: '',
  instagram: '',
  email: '',
  whatsapp: '',
  linktree: '',
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutContent>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/about').then(r => r.ok ? r.json() : null).then(d => d && setForm(d))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/content/about', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">About</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 flex flex-col gap-4 max-w-xl">
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-2">Profile Photo</label>
          <FileUpload onUploaded={url => setForm(f => ({ ...f, profilePhotoUrl: url }))} currentUrl={form.profilePhotoUrl} label="Upload profile photo" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Full Bio</label>
          <textarea value={form.fullBio} onChange={e => setForm(f => ({ ...f, fullBio: e.target.value }))} rows={8}
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam resize-none" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Instagram URL</label>
          <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
            placeholder="https://www.instagram.com/yourhandle"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">WhatsApp Number</label>
          <input value={form.whatsapp ?? ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            placeholder="+971555895441"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Linktree URL</label>
          <input value={form.linktree ?? ''} onChange={e => setForm(f => ({ ...f, linktree: e.target.value }))}
            placeholder="https://linktr.ee/yourhandle"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <div>
          <label className="font-sans text-xs text-charcoal/50 uppercase tracking-wider block mb-1">Contact Email</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email"
            className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam" />
        </div>
        <button onClick={save} disabled={saving}
          className="bg-burnt text-white font-sans text-xs tracking-wider uppercase py-2.5 rounded hover:bg-burnt/85 disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
