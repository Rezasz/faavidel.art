'use client'
import { useEffect, useState } from 'react'
import { MusicIndex, Track } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2 } from 'lucide-react'

const emptyTrack = (): Partial<Track> => ({ title: '', fileUrl: '', artworkUrl: '', duration: '' })

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [form, setForm] = useState<Partial<Track>>(emptyTrack())
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/music/index').then(r => r.ok ? r.json() : null).then(d => setTracks(d?.tracks ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const track: Track = {
        id: form.id ?? Date.now().toString(),
        title: form.title!,
        fileUrl: form.fileUrl!,
        artworkUrl: form.artworkUrl ?? '',
        duration: form.duration ?? '',
        order: form.id && tracks.find(t => t.id === form.id) ? tracks.find(t => t.id === form.id)!.order : tracks.length,
        createdAt: new Date().toISOString(),
      }
      const updated: MusicIndex = {
        tracks: form.id && tracks.find(t => t.id === form.id)
          ? tracks.map(t => t.id === form.id ? track : t)
          : [...tracks, track]
      }
      await fetch('/api/content/music/index', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(updated),
      })
      await load()
      setForm(emptyTrack())
      setAdding(false)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this track?')) return
    try {
      await fetch('/api/content/music/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tracks: tracks.filter(t => t.id !== id) }),
      })
      await load()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Music</h1>
        <button onClick={() => { setForm(emptyTrack()); setAdding(true) }}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Track
        </button>
      </div>
      {adding && (
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <input placeholder="Track title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Duration (e.g. 3:42)" value={form.duration ?? ''} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <div>
              <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Audio file</p>
              <FileUpload accept="audio/*" onUploaded={url => setForm(f => ({ ...f, fileUrl: url }))} currentUrl={form.fileUrl} label="Upload audio" />
            </div>
            <div>
              <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Artwork</p>
              <FileUpload onUploaded={url => setForm(f => ({ ...f, artworkUrl: url }))} currentUrl={form.artworkUrl} label="Upload artwork" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.fileUrl}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setAdding(false); setForm(emptyTrack()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {tracks.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No tracks yet.</p>}
        {tracks.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 px-5 py-3">
            <span className="font-sans text-xs text-charcoal/30 w-5">{i + 1}</span>
            {t.artworkUrl && <img src={t.artworkUrl} alt={t.title} className="w-10 h-10 object-cover rounded" />}
            <p className="font-sans text-sm text-charcoal flex-1">{t.title}</p>
            <p className="font-sans text-xs text-charcoal/40">{t.duration}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => { setForm(t); setAdding(true) }} className="font-sans text-xs text-ocean hover:underline">Edit</button>
              <button onClick={() => remove(t.id)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
