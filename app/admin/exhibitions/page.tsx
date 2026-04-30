'use client'
import { useEffect, useState } from 'react'
import { Exhibition, ExhibitionsIndex } from '@/lib/types'
import seed from '@/scripts/exhibitions-data.json'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Trash2 } from 'lucide-react'

const inputCls =
  'bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full'

const photoSrc = (img: string) =>
  !img ? '' : img.startsWith('http') ? img : `/exhibitions/${img}`

const emptyExhibition = (year: number, order: number): Exhibition => ({
  order,
  year,
  title: '',
  dateLabel: '',
  venue: '',
  city: '',
  country: '',
  format: '',
  curator: '',
  link: '',
  image: '',
})

const sortForDisplay = (list: Exhibition[]) =>
  list.slice().sort((a, b) => (b.year - a.year) || (a.order - b.order))

export default function AdminExhibitionsPage() {
  const [items, setItems] = useState<Exhibition[]>([])
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [draft, setDraft] = useState<Exhibition | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = async () => {
    const r = await fetch('/api/content/exhibitions/index')
    const d: ExhibitionsIndex | null = r.ok ? await r.json() : null
    const list = d ? (d.exhibitions ?? []) : (seed as Exhibition[])
    setItems(sortForDisplay(list))
  }

  useEffect(() => { load() }, [])

  const persist = async (next: Exhibition[]) => {
    setSaving(true)
    try {
      await fetch('/api/content/exhibitions/index', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ exhibitions: next } satisfies ExhibitionsIndex),
      })
      await load()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setDraft({ ...items[idx] })
  }

  const startNew = () => {
    const year = new Date().getFullYear()
    const orderInYear = items.filter(e => e.year === year).length + 1
    setEditingIdx(-1)
    setDraft(emptyExhibition(year, orderInYear))
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setDraft(null)
  }

  const saveDraft = async () => {
    if (!draft) return
    const next = editingIdx === -1
      ? [...items, draft]
      : items.map((e, i) => (i === editingIdx ? draft : e))
    await persist(next)
    cancelEdit()
  }

  const remove = async (idx: number) => {
    if (!confirm('Delete this exhibition?')) return
    const target = items[idx]
    const next = items
      .filter((_, i) => i !== idx)
      .map(e =>
        e.year === target.year && e.order > target.order
          ? { ...e, order: e.order - 1 }
          : e
      )
    await persist(next)
  }

  // Move within the same year
  const move = async (idx: number, dir: -1 | 1) => {
    const target = items[idx]
    const sameYear = items
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => e.year === target.year)
      .sort((a, b) => a.e.order - b.e.order)
    const pos = sameYear.findIndex(({ i }) => i === idx)
    const swap = sameYear[pos + dir]
    if (!swap) return
    const next = items.map((e, i) => {
      if (i === idx) return { ...e, order: swap.e.order }
      if (i === swap.i) return { ...e, order: target.order }
      return e
    })
    await persist(next)
  }

  const years = Array.from(new Set(items.map(e => e.year))).sort((a, b) => b - a)

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Practice</p>
          <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Exhibitions</h1>
          <div className="w-12 h-px bg-brand-amber/60" />
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Saving…</span>}
          {saved && <span className="font-mono text-[10px] tracking-widest uppercase text-brand-iris">Saved ✓</span>}
          <BrushButton onClick={startNew}>+ Add Exhibition</BrushButton>
        </div>
      </div>

      <p className="font-serif text-brand-night/70 max-w-2xl mb-6">
        Edit the year-grouped exhibition list shown on the public page. Use the up/down arrows to reorder within a year.
        Uploaded images go to Vercel Blob; legacy images stored under <code className="font-mono text-[11px]">public/exhibitions/</code> still work.
      </p>

      {draft && (
        <div className="bg-white border border-brand-night/10 p-6 mb-6">
          <h2 className="font-serif italic text-xl text-brand-night mb-4">
            {editingIdx === -1 ? 'New' : 'Edit'} Exhibition
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Title</label>
                <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className={inputCls} placeholder="NFT.NYC 2025 — Community Artist Showcase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Year</label>
                  <input type="number" value={draft.year} onChange={e => setDraft({ ...draft, year: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Order (within year)</label>
                  <input type="number" value={draft.order} onChange={e => setDraft({ ...draft, order: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Date label</label>
                <input value={draft.dateLabel} onChange={e => setDraft({ ...draft, dateLabel: e.target.value })} className={inputCls} placeholder="June 25–27, 2025" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Venue</label>
                <input value={draft.venue} onChange={e => setDraft({ ...draft, venue: e.target.value })} className={inputCls} placeholder="Marriott Marquis" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">City</label>
                  <input value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} className={inputCls} placeholder="New York" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Country</label>
                  <input value={draft.country} onChange={e => setDraft({ ...draft, country: e.target.value })} className={inputCls} placeholder="United States" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Format</label>
                <input value={draft.format} onChange={e => setDraft({ ...draft, format: e.target.value })} className={inputCls} placeholder="Digital / Physical Exhibition" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Curator (optional)</label>
                <input value={draft.curator} onChange={e => setDraft({ ...draft, curator: e.target.value })} className={inputCls} placeholder="One Love Art DAO" />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Link (optional)</label>
                <input value={draft.link} onChange={e => setDraft({ ...draft, link: e.target.value })} className={inputCls} placeholder="https://nft.nyc" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-2">Image</label>
              <FileUpload
                onUploaded={url => setDraft({ ...draft, image: url })}
                currentUrl={photoSrc(draft.image)}
                label="Upload exhibition image"
              />
              <div className="mt-3">
                <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">
                  Or filename in <code className="font-mono text-[11px]">/public/exhibitions/</code>
                </label>
                <input
                  value={draft.image.startsWith('http') ? '' : draft.image}
                  onChange={e => setDraft({ ...draft, image: e.target.value })}
                  className={inputCls}
                  placeholder="my-exhibition.jpg"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 items-center">
            <BrushButton onClick={saveDraft} disabled={saving || !draft.title}>
              {saving ? 'Saving…' : 'Save'}
            </BrushButton>
            <button
              onClick={cancelEdit}
              className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {years.map(year => {
          const yearItems = items
            .map((e, i) => ({ e, i }))
            .filter(({ e }) => e.year === year)
            .sort((a, b) => a.e.order - b.e.order)
          return (
            <section key={year}>
              <h2 className="font-serif italic text-xl text-brand-night/70 mb-3">{year}</h2>
              <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
                {yearItems.length === 0 && (
                  <p className="p-5 font-serif text-sm text-brand-night/40">No exhibitions in {year}.</p>
                )}
                {yearItems.map(({ e, i }, posInYear) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40 w-6 text-center">
                      {String(e.order).padStart(2, '0')}
                    </span>
                    {e.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoSrc(e.image)} alt={e.title} className="w-12 h-12 object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-brand-night truncate">{e.title || <em className="text-brand-night/30">untitled</em>}</p>
                      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/45 truncate">
                        {[e.venue, e.city, e.country].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <button
                      disabled={posInYear === 0}
                      onClick={() => move(i, -1)}
                      className="font-mono text-[12px] text-brand-night/60 hover:text-brand-night disabled:opacity-20"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      disabled={posInYear === yearItems.length - 1}
                      onClick={() => move(i, 1)}
                      className="font-mono text-[12px] text-brand-night/60 hover:text-brand-night disabled:opacity-20"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => startEdit(i)}
                      className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(i)}
                      className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
