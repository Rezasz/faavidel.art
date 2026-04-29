'use client'
import { useEffect, useState } from 'react'
import { GalleryIndex, Artwork } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Trash2, GripVertical } from 'lucide-react'

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
    try {
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
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this artwork?')) return
    try {
      await fetch(`/api/content/gallery/${slug}`, { method: 'DELETE' })
      await fetch('/api/content/gallery/index', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ artworks: artworks.filter(a => a.slug !== slug) }),
      })
      await load()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const startEdit = (art: GalleryIndex['artworks'][number]) => {
    setForm({ ...art, description: '', year: new Date().getFullYear() })
    setEditing(true)
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Collection</p>
          <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Gallery</h1>
          <div className="w-12 h-px bg-brand-amber/60" />
        </div>
        <BrushButton onClick={() => { setForm(emptyArtwork()); setEditing(true) }}>
          + Add Artwork
        </BrushButton>
      </div>

      {editing && (
        <div className="bg-white border border-brand-night/10 p-6 mb-6">
          <h2 className="font-serif italic text-xl text-brand-night mb-4">{form.slug ? 'Edit' : 'New'} Artwork</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
              <input placeholder="Year" type="number" value={form.year ?? ''} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
              <input placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? (form.tags as string[]).join(', ') : ((form.tags as unknown as string) ?? '')}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value as unknown as string[] }))}
                className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
              <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 resize-none" />
            </div>
            <div>
              <FileUpload onUploaded={url => setForm(f => ({ ...f, imageUrl: url }))} currentUrl={form.imageUrl} label="Upload artwork image" />
            </div>
          </div>
          <div className="flex gap-3 mt-4 items-center">
            <BrushButton onClick={save} disabled={saving || !form.title || !form.imageUrl}>
              {saving ? 'Saving…' : 'Save'}
            </BrushButton>
            <button onClick={() => { setEditing(false); setForm(emptyArtwork()) }}
              className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
        {artworks.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No artwork yet.</p>}
        {artworks.map(art => (
          <div key={art.slug} className="flex items-center gap-4 px-5 py-3">
            <GripVertical size={14} className="text-brand-night/30" />
            {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="w-12 h-12 object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-brand-night truncate">{art.title}</p>
              <div className="flex gap-1 mt-0.5">
                {art.tags.map(t => <span key={t} className="font-mono text-[10px] text-brand-iris uppercase tracking-widest mr-1">{t}</span>)}
              </div>
            </div>
            <button onClick={() => startEdit(art)} className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">Edit</button>
            <button onClick={() => remove(art.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
