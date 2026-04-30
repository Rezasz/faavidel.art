'use client'
import { useEffect, useState } from 'react'
import { AboutContent } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'

const defaults: AboutContent = {
  fullBio: '',
  profilePhotoUrl: '',
  instagram: '',
  email: '',
  whatsapp: '',
  linktree: '',
  linkedin: '',
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutContent>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const r = await fetch('/api/content/about')
    if (r.ok) {
      const d = await r.json()
      if (d) setForm({ ...defaults, ...d })
    }
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/content/about', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form),
      })
      await load()
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
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Profile</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">About</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />
      <div className="bg-white border border-brand-night/10 p-6 flex flex-col gap-4 max-w-xl">
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-2">Profile Photo</label>
          <FileUpload onUploaded={url => setForm(f => ({ ...f, profilePhotoUrl: url }))} currentUrl={form.profilePhotoUrl} label="Upload profile photo" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Full Bio</label>
          <textarea value={form.fullBio} onChange={e => setForm(f => ({ ...f, fullBio: e.target.value }))} rows={8}
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full resize-none" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Instagram URL</label>
          <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
            placeholder="https://www.instagram.com/yourhandle"
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">WhatsApp Number</label>
          <input value={form.whatsapp ?? ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            placeholder="+971555895441"
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Linktree URL</label>
          <input value={form.linktree ?? ''} onChange={e => setForm(f => ({ ...f, linktree: e.target.value }))}
            placeholder="https://linktr.ee/yourhandle"
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">LinkedIn URL</label>
          <input value={form.linkedin ?? ''} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
            placeholder="https://www.linkedin.com/in/yourhandle"
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
        </div>
        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Contact Email</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email"
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full" />
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
