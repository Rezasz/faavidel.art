'use client'
import { useEffect, useState } from 'react'
import { MusicIndex, Track } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Trash2, Music, Link } from 'lucide-react'

type SourceType = 'file' | 'youtube'

const emptyTrack = (): Partial<Track> => ({ title: '', fileUrl: '', youtubeUrl: '', artworkUrl: '', duration: '' })

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [form, setForm] = useState<Partial<Track>>(emptyTrack())
  const [sourceType, setSourceType] = useState<SourceType>('file')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/music/index').then(r => r.ok ? r.json() : null).then(d => setTracks(d?.tracks ?? []))

  useEffect(() => { load() }, [])

  const startAdd = () => {
    setForm(emptyTrack())
    setSourceType('file')
    setAdding(true)
  }

  const startEdit = (t: Track) => {
    setForm(t)
    setSourceType(t.youtubeUrl ? 'youtube' : 'file')
    setAdding(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const track: Track = {
        id: form.id ?? Date.now().toString(),
        title: form.title!,
        fileUrl: sourceType === 'file' ? (form.fileUrl ?? '') : '',
        youtubeUrl: sourceType === 'youtube' ? (form.youtubeUrl ?? '') : '',
        artworkUrl: form.artworkUrl ?? '',
        duration: form.duration ?? '',
        order: form.id && tracks.find(t => t.id === form.id)
          ? tracks.find(t => t.id === form.id)!.order
          : tracks.length,
        createdAt: form.createdAt ?? new Date().toISOString(),
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

  const canSave = form.title && (sourceType === 'file' ? form.fileUrl : form.youtubeUrl)

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Sound</p>
          <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Music</h1>
          <div className="w-12 h-px bg-brand-amber/60" />
        </div>
        <BrushButton onClick={startAdd}>
          + Add Track
        </BrushButton>
      </div>

      {adding && (
        <div className="bg-white border border-brand-night/10 p-5 mb-5">
          {/* Source type toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSourceType('file')}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors
                ${sourceType === 'file' ? 'bg-brand-iris text-brand-cream' : 'border border-brand-night/20 text-brand-night/55 hover:border-brand-iris'}`}
            >
              <Music size={13} /> Upload Audio File
            </button>
            <button
              onClick={() => setSourceType('youtube')}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors
                ${sourceType === 'youtube' ? 'bg-brand-amber text-brand-night' : 'border border-brand-night/20 text-brand-night/55 hover:border-brand-amber'}`}
            >
              <Link size={13} /> YouTube Link
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <input
              placeholder="Track title"
              value={form.title ?? ''}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2"
            />
            <input
              placeholder="Duration (e.g. 3:42)"
              value={form.duration ?? ''}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2"
            />

            {sourceType === 'file' ? (
              <div className="md:col-span-2">
                <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Audio File</p>
                <FileUpload
                  accept="audio/*"
                  onUploaded={url => setForm(f => ({ ...f, fileUrl: url }))}
                  currentUrl={form.fileUrl}
                  label="Upload audio (MP3, WAV, AAC…)"
                />
              </div>
            ) : (
              <div className="md:col-span-2">
                <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">YouTube URL</p>
                <input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.youtubeUrl ?? ''}
                  onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                  className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full"
                />
                <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40 mt-1">Regular YouTube watch URLs are accepted</p>
              </div>
            )}

            <div className="md:col-span-2">
              <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Artwork Image</p>
              <FileUpload
                onUploaded={url => setForm(f => ({ ...f, artworkUrl: url }))}
                currentUrl={form.artworkUrl}
                label="Upload cover artwork"
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <BrushButton onClick={save} disabled={saving || !canSave}>
              {saving ? 'Saving…' : 'Save Track'}
            </BrushButton>
            <button
              onClick={() => { setAdding(false); setForm(emptyTrack()) }}
              className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
        {tracks.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No tracks yet. Add your first track above.</p>}
        {tracks.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 px-5 py-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-brand-night/30 w-5">{i + 1}</span>
            {t.artworkUrl
              ? <img src={t.artworkUrl} alt={t.title} className="w-10 h-10 object-cover" />
              : <div className="w-10 h-10 bg-brand-night/5 flex items-center justify-center"><Music size={14} className="text-brand-night/30" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-brand-night truncate">{t.title}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40">
                {t.youtubeUrl ? '▶ YouTube' : t.fileUrl ? '♪ Audio file' : '—'} {t.duration && `· ${t.duration}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => startEdit(t)} className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">Edit</button>
              <button onClick={() => remove(t.id)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
