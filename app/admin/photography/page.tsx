'use client'
import { useEffect, useState } from 'react'
import { PhotographyIndex, PhotoSeriesDetail, Photo } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

export default function AdminPhotographyPage() {
  const [series, setSeries] = useState<PhotographyIndex['series']>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [seriesPhotos, setSeriesPhotos] = useState<Record<string, Photo[]>>({})
  const [newSeries, setNewSeries] = useState({ title: '', description: '', coverUrl: '' })
  const [addingPhoto, setAddingPhoto] = useState<string | null>(null)
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const [newPhotoUrl, setNewPhotoUrl] = useState('')

  const load = () =>
    fetch('/api/content/photography/index').then(r => r.ok ? r.json() : null).then(d => setSeries(d?.series ?? []))

  useEffect(() => { load() }, [])

  const loadPhotos = async (slug: string) => {
    const res = await fetch(`/api/content/photography/${slug}/index`)
    if (!res.ok) return
    const data: PhotoSeriesDetail = await res.json()
    setSeriesPhotos(p => ({ ...p, [slug]: data?.photos ?? [] }))
  }

  const toggle = (slug: string) => {
    if (expanded === slug) { setExpanded(null) }
    else { setExpanded(slug); loadPhotos(slug) }
  }

  const addSeries = async () => {
    if (!newSeries.title || !newSeries.coverUrl) return
    try {
      const slug = newSeries.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const detail: PhotoSeriesDetail = {
        slug, title: newSeries.title, description: newSeries.description,
        coverUrl: newSeries.coverUrl, order: series.length, createdAt: new Date().toISOString(), photos: [],
      }
      await fetch(`/api/content/photography/${slug}/index`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(detail),
      })
      await fetch('/api/content/photography/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ series: [...series, { slug, title: detail.title, coverUrl: detail.coverUrl, order: detail.order }] }),
      })
      setNewSeries({ title: '', description: '', coverUrl: '' })
      await load()
    } catch (err) {
      console.error('Add series error:', err)
    }
  }

  const addPhoto = async (seriesSlug: string) => {
    if (!newPhotoUrl) return
    try {
      const id = Date.now().toString()
      const photo: Photo = { id, url: newPhotoUrl, caption: newPhotoCaption, order: (seriesPhotos[seriesSlug] ?? []).length }
      const photos = [...(seriesPhotos[seriesSlug] ?? []), photo]
      const res = await fetch(`/api/content/photography/${seriesSlug}/index`)
      const detail = res.ok ? await res.json() : {}
      await fetch(`/api/content/photography/${seriesSlug}/index`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...detail, photos }),
      })
      setSeriesPhotos(p => ({ ...p, [seriesSlug]: photos }))
      setNewPhotoUrl('')
      setNewPhotoCaption('')
      setAddingPhoto(null)
    } catch (err) {
      console.error('Add photo error:', err)
    }
  }

  const removeSeries = async (slug: string) => {
    if (!confirm('Delete this series and all photos?')) return
    try {
      await fetch('/api/content/photography/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ series: series.filter(s => s.slug !== slug) }),
      })
      await load()
    } catch (err) {
      console.error('Remove series error:', err)
    }
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Series</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Photography</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />

      <div className="bg-white border border-brand-night/10 p-5 mb-6">
        <h2 className="font-serif italic text-xl text-brand-night mb-3">New Series</h2>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input placeholder="Series title" value={newSeries.title} onChange={e => setNewSeries(s => ({ ...s, title: e.target.value }))}
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
          <input placeholder="Description" value={newSeries.description} onChange={e => setNewSeries(s => ({ ...s, description: e.target.value }))}
            className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
          <FileUpload onUploaded={url => setNewSeries(s => ({ ...s, coverUrl: url }))} currentUrl={newSeries.coverUrl} label="Cover image" />
        </div>
        <BrushButton onClick={addSeries} disabled={!newSeries.title || !newSeries.coverUrl}>
          Add Series
        </BrushButton>
      </div>

      <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
        {series.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No series yet.</p>}
        {series.map(s => (
          <div key={s.slug}>
            <div className="flex items-center gap-3 px-5 py-3">
              <button type="button" onClick={() => toggle(s.slug)} className="text-brand-night/40">
                {expanded === s.slug ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {s.coverUrl && <img src={s.coverUrl} alt={s.title} className="w-10 h-10 object-cover" />}
              <p className="font-serif text-sm text-brand-night flex-1">{s.title}</p>
              <button onClick={() => removeSeries(s.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            {expanded === s.slug && (
              <div className="px-12 pb-4">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {(seriesPhotos[s.slug] ?? []).map(photo => (
                    <div key={photo.id} className="aspect-square relative">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {addingPhoto === s.slug ? (
                  <div className="flex gap-2 items-center flex-wrap">
                    <div className="w-32">
                      <FileUpload onUploaded={url => setNewPhotoUrl(url)} label="Photo" currentUrl={newPhotoUrl} />
                    </div>
                    <input placeholder="Caption (optional)" value={newPhotoCaption} onChange={e => setNewPhotoCaption(e.target.value)}
                      className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 flex-1 min-w-0" />
                    <BrushButton onClick={() => addPhoto(s.slug)} disabled={!newPhotoUrl}>Add</BrushButton>
                    <button onClick={() => { setAddingPhoto(null); setNewPhotoUrl(''); setNewPhotoCaption('') }}
                      className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors shrink-0">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingPhoto(s.slug)}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">
                    <Plus size={12} /> Add Photo
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
