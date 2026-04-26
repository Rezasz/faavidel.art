'use client'
import { useEffect, useState } from 'react'
import { VideoIndex, VideoItem } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2, Link, Upload } from 'lucide-react'

type SourceType = 'youtube' | 'file'

const emptyVideo = (): Partial<VideoItem> => ({ title: '', description: '', embedUrl: '', thumbnailUrl: '' })

function toEmbedUrl(input: string): string {
  try {
    const url = new URL(input)
    // youtube.com/watch?v=ID
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${url.searchParams.get('v')}`
    }
    // youtu.be/ID
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${url.pathname}`
    }
    // vimeo.com/ID
    if (url.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video${url.pathname}`
    }
  } catch {}
  return input // return as-is if already an embed URL or unrecognised
}

export default function AdminVideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [form, setForm] = useState<Partial<VideoItem>>(emptyVideo())
  const [sourceType, setSourceType] = useState<SourceType>('youtube')
  const [rawUrl, setRawUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/video/index').then(r => r.ok ? r.json() : null).then(d => setVideos(d?.videos ?? []))

  useEffect(() => { load() }, [])

  const startAdd = () => {
    setForm(emptyVideo())
    setRawUrl('')
    setSourceType('youtube')
    setAdding(true)
  }

  const startEdit = (v: VideoItem) => {
    setForm(v)
    setRawUrl(v.embedUrl)
    // Detect if it's a file (blob URL) or embed
    setSourceType(v.embedUrl.includes('blob.vercel-storage') ? 'file' : 'youtube')
    setAdding(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const embedUrl = sourceType === 'youtube' ? toEmbedUrl(rawUrl) : (form.embedUrl ?? '')
      const video: VideoItem = {
        id: form.id ?? Date.now().toString(),
        title: form.title!,
        description: form.description ?? '',
        embedUrl,
        thumbnailUrl: form.thumbnailUrl ?? '',
        order: form.id && videos.find(v => v.id === form.id)
          ? videos.find(v => v.id === form.id)!.order
          : videos.length,
        createdAt: form.createdAt ?? new Date().toISOString(),
      }
      const updated: VideoIndex = {
        videos: form.id && videos.find(v => v.id === form.id)
          ? videos.map(v => v.id === form.id ? video : v)
          : [...videos, video]
      }
      await fetch('/api/content/video/index', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(updated),
      })
      await load()
      setForm(emptyVideo())
      setRawUrl('')
      setAdding(false)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this video?')) return
    try {
      await fetch('/api/content/video/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ videos: videos.filter(v => v.id !== id) }),
      })
      await load()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const canSave = form.title && (sourceType === 'youtube' ? rawUrl : form.embedUrl)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Video</h1>
        <button onClick={startAdd}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded hover:bg-ocean/85 transition-colors">
          <Plus size={14} /> Add Video
        </button>
      </div>

      {adding && (
        <div className="bg-white rounded-lg border border-gray-100 p-5 mb-5">
          {/* Source type toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setSourceType('youtube'); setForm(f => ({ ...f, embedUrl: '' })) }}
              className={`flex items-center gap-2 px-4 py-2 rounded font-sans text-xs tracking-wider uppercase transition-colors
                ${sourceType === 'youtube' ? 'bg-burnt text-white' : 'border border-gray-200 text-charcoal/50 hover:border-burnt'}`}
            >
              <Link size={13} /> YouTube / Vimeo Link
            </button>
            <button
              onClick={() => { setSourceType('file'); setRawUrl('') }}
              className={`flex items-center gap-2 px-4 py-2 rounded font-sans text-xs tracking-wider uppercase transition-colors
                ${sourceType === 'file' ? 'bg-ocean text-white' : 'border border-gray-200 text-charcoal/50 hover:border-ocean'}`}
            >
              <Upload size={13} /> Upload Video File
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Title"
              value={form.title ?? ''}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam"
            />
            <textarea
              placeholder="Description"
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam resize-none"
            />

            {sourceType === 'youtube' ? (
              <div className="md:col-span-2">
                <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">YouTube or Vimeo URL</p>
                <input
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={rawUrl}
                  onChange={e => setRawUrl(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-2 font-sans text-sm w-full focus:outline-none focus:border-seafoam"
                />
                {rawUrl && (
                  <p className="font-sans text-xs text-charcoal/30 mt-1">
                    Embed URL: {toEmbedUrl(rawUrl)}
                  </p>
                )}
              </div>
            ) : (
              <div className="md:col-span-2">
                <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Video File</p>
                <FileUpload
                  accept="video/*"
                  onUploaded={url => setForm(f => ({ ...f, embedUrl: url }))}
                  currentUrl={form.embedUrl}
                  label="Upload video (MP4, MOV, WebM…)"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <p className="font-sans text-xs text-charcoal/50 mb-1 uppercase tracking-wider">Thumbnail Image</p>
              <FileUpload
                onUploaded={url => setForm(f => ({ ...f, thumbnailUrl: url }))}
                currentUrl={form.thumbnailUrl}
                label="Upload thumbnail"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !canSave}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50 hover:bg-burnt/85 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Video'}
            </button>
            <button
              onClick={() => { setAdding(false); setForm(emptyVideo()); setRawUrl('') }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {videos.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No videos yet. Add your first video above.</p>}
        {videos.map(v => (
          <div key={v.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {v.thumbnailUrl
                ? <img src={v.thumbnailUrl} alt={v.title} className="w-12 h-9 object-cover rounded shrink-0" />
                : <div className="w-12 h-9 rounded bg-off-white-2 flex items-center justify-center shrink-0"><Link size={14} className="text-charcoal/30" /></div>
              }
              <div className="min-w-0">
                <p className="font-sans text-sm text-charcoal truncate">{v.title}</p>
                <p className="font-sans text-xs text-charcoal/40 truncate max-w-xs">{v.embedUrl}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <button onClick={() => startEdit(v)} className="font-sans text-xs text-ocean hover:underline">Edit</button>
              <button onClick={() => remove(v.id)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
