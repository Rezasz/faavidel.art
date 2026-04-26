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
    const ext = file.name.split('.').pop()
    const pathname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const fd = new FormData()
    fd.append('file', file)
    fd.append('pathname', pathname)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    setPreview(url)
    onUploaded(url)
    setUploading(false)
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
          <img src={preview} alt="preview" className="max-h-32 rounded border border-gray-200 object-contain" />
          <button
            type="button"
            onClick={() => { setPreview(''); onUploaded('') }}
            className="absolute -top-2 -right-2 bg-burnt text-white rounded-full w-5 h-5 flex items-center justify-center"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <label
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-8 cursor-pointer hover:border-seafoam transition-colors"
        >
          <Upload size={20} className="text-gray-400" />
          <span className="font-sans text-xs text-gray-400 tracking-wider">
            {uploading ? 'Uploading...' : label}
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
