'use client'
import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'

interface Props {
  accept?: string
  onUploaded: (url: string) => void
  label?: string
  currentUrl?: string
}

export default function FileUpload({ accept = 'image/*', onUploaded, label = 'Upload file', currentUrl }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl ?? '')

  const upload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const pathname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const fd = new FormData()
      fd.append('file', file)
      fd.append('pathname', pathname)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const { url } = await res.json()
      setPreview(url)
      onUploaded(url)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }, [onUploaded])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="preview" className="max-h-32 border border-brand-night/20 object-contain" />
          <button
            type="button"
            onClick={() => { setPreview(''); onUploaded('') }}
            className="absolute -top-2 -right-2 bg-brand-rose text-brand-cream rounded-full w-5 h-5 flex items-center justify-center"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <label
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          className="flex flex-col items-center gap-2 border border-dashed border-brand-night/30 bg-brand-parchment p-8 cursor-pointer hover:border-brand-iris transition-colors"
        >
          <Upload size={20} className="text-brand-night/40" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55">
            {uploading ? 'Uploading…' : label}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
          />
        </label>
      )}
    </div>
  )
}
