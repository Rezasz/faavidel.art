'use client'
import { useEffect, useState } from 'react'
import { VideoIndex, VideoItem } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'

const emptyVideo = (): Partial<VideoItem> => ({ title: '', description: '', embedUrl: '', thumbnailUrl: '' })

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [form, setForm] = useState<Partial<VideoItem>>(emptyVideo())
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/video/index').then(r => r.ok ? r.json() : null).then(d => setVideos(d?.videos ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    const video: VideoItem = {
      id: form.id ?? Date.now().toString(),
      title: form.title!,
      description: form.description ?? '',
      embedUrl: form.embedUrl!,
      thumbnailUrl: form.thumbnailUrl ?? '',
      order: videos.findIndex(v => v.id === form.id) >= 0 ? videos.find(v => v.id === form.id)!.order : videos.length,
      createdAt: new Date().toISOString(),
    }
    const updated: VideoIndex = { videos: form.id && videos.find(v => v.id === form.id)
      ? videos.map(v => v.id === form.id ? video : v)
      : [...videos, video]
    }
    await fetch('/api/content/video/index', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(updated),
    })
    await load()
    setForm(emptyVideo())
    setAdding(false)
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this video?')) return
    await fetch('/api/content/video/index', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ videos: videos.filter(v => v.id !== id) }),
    })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Video</h1>
        <button onClick={() => { setForm(emptyVideo()); setAdding(true) }}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Video
        </button>
      </div>
      {adding && (
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Embed URL (YouTube/Vimeo embed URL)" value={form.embedUrl ?? ''} onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam col-span-2 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.embedUrl}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setForm(emptyVideo()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {videos.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No videos yet.</p>}
        {videos.map(v => (
          <div key={v.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-sans text-sm text-charcoal">{v.title}</p>
              <p className="font-sans text-xs text-charcoal/40 truncate max-w-xs">{v.embedUrl}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setForm(v); setAdding(true) }} className="font-sans text-xs text-ocean hover:underline">Edit</button>
              <button onClick={() => remove(v.id)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
