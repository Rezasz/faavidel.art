'use client'
import { useEffect, useState } from 'react'
import { GalleryIndex, Artwork } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Trash2, Plus, GripVertical } from 'lucide-react'

const emptyArtwork = (): Partial<Artwork> => ({
  title: '', description: '', tags: [], imageUrl: '', year: new Date().getFullYear(), order: 0,
})

export default function AdminGalleryPage() {
  const [artworks, setArtworks] = useState<GalleryIndex['artworks']>([])
  const [form, setForm] = useState<Partial<Artwork>>(emptyArtwork())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/gallery/index').then(r => r.ok ? r.json() : null).then(d => setArtworks(d?.artworks ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const slug = (form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) || 'untitled'
    const tagsArray: string[] = typeof form.tags === 'string'
      ? (form.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : (form.tags as string[]) ?? []

    const artwork: Artwork = {
      slug,
      title: form.title!,
      description: form.description ?? '',
      tags: tagsArray,
      imageUrl: form.imageUrl!,
      year: form.year ?? new Date().getFullYear(),
      order: artworks.findIndex(a => a.slug === slug) >= 0
        ? artworks.find(a => a.slug === slug)!.order
        : artworks.length,
      createdAt: new Date().toISOString(),
    }

    await fetch(`/api/content/gallery/${slug}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(artwork),
    })

    const existing = artworks.find(a => a.slug === slug)
    const updatedList = existing
      ? artworks.map(a => a.slug === slug ? { slug, title: artwork.title, imageUrl: artwork.imageUrl, tags: artwork.tags, order: artwork.order } : a)
      : [...artworks, { slug, title: artwork.title, imageUrl: artwork.imageUrl, tags: artwork.tags, order: artwork.order }]

    await fetch('/api/content/gallery/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ artworks: updatedList }),
    })

    await load()
    setForm(emptyArtwork())
    setEditing(false)
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this artwork?')) return
    await fetch('/api/content/gallery/index', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ artworks: artworks.filter(a => a.slug !== slug) }),
    })
    await load()
  }

  const startEdit = (art: GalleryIndex['artworks'][number]) => {
    setForm({ ...art, description: '', year: new Date().getFullYear() })
    setEditing(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Gallery</h1>
        <button onClick={() => { setForm(emptyArtwork()); setEditing(true) }}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded hover:bg-ocean/85 transition-colors">
          <Plus size={14} /> Add Artwork
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">{form.slug ? 'Edit' : 'New'} Artwork</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <input placeholder="Year" type="number" value={form.year ?? ''} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <input placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? (form.tags as string[]).join(', ') : (form.tags as string ?? '')}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value as unknown as string[] }))}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
              <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam resize-none" />
            </div>
            <div>
              <FileUpload onUploaded={url => setForm(f => ({ ...f, imageUrl: url }))} currentUrl={form.imageUrl} label="Upload artwork image" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving || !form.title || !form.imageUrl}
              className="bg-burnt text-white font-sans text-xs tracking-wider uppercase px-5 py-2 rounded hover:bg-burnt/85 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyArtwork()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs tracking-wider uppercase px-5 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {artworks.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No artwork yet.</p>}
        {artworks.map(art => (
          <div key={art.slug} className="flex items-center gap-4 px-5 py-3">
            <GripVertical size={14} className="text-gray-300" />
            {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-charcoal truncate">{art.title}</p>
              <div className="flex gap-1 mt-0.5">
                {art.tags.map(t => <span key={t} className="font-sans text-[10px] text-seafoam uppercase tracking-wider mr-1">{t}</span>)}
              </div>
            </div>
            <button onClick={() => startEdit(art)} className="font-sans text-xs text-ocean hover:underline">Edit</button>
            <button onClick={() => remove(art.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
