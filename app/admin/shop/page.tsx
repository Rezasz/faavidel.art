'use client'
import { useEffect, useState } from 'react'
import { Marketplace, MarketplacesIndex } from '@/lib/types'
import BrushButton from '@/components/atmosphere/BrushButton'

const DEFAULTS: Marketplace[] = [
  { title: 'Wallet Bubbles',    url: 'https://walletbubbles.com/faavidel/55df5f8e-14e8-4bcc-a451-057a1da816ff', domain: 'walletbubbles.com', description: 'A curated portfolio space — a visual gallery of Faavidel’s digital works across the wallets she has minted to.', order: 1 },
  { title: 'hug.art',           url: 'https://hug.art/artists/Faavidel',                                       domain: 'hug.art',           description: 'Web3 art platform spotlighting emerging artists. Discover and collect Faavidel’s editions on Ethereum.',         order: 2 },
  { title: 'Drip.haus',         url: 'https://drip.haus/FAAVIDEL',                                             domain: 'drip.haus',         description: 'Solana-based platform for free NFT drops — pieces sent directly to collectors’ wallets, no fees.',                  order: 3 },
  { title: 'Manifold',          url: 'https://studio.manifold.xyz/auth/login',                                 domain: 'studio.manifold.xyz', description: 'Independent creator-owned smart contracts. Used for self-published collections — sign in to view current releases.', order: 4 },
  { title: 'Objkt',             url: 'https://objkt.com/users/tz1XWjwZAJti79N6ATrHwNozh9FAUSadn6cf',           domain: 'objkt.com',         description: 'Tezos NFT marketplace — Faavidel’s 1/1 paintings and editions, available to bid, buy, or trade.',                  order: 5 },
]

const inputCls = 'bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 w-full'

export default function AdminShopPage() {
  const [items, setItems] = useState<Marketplace[]>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/content/shop/marketplaces')
      .then(r => r.ok ? r.json() : null)
      .then((d: MarketplacesIndex | null) => {
        if (d?.marketplaces?.length) setItems(d.marketplaces.slice().sort((a, b) => a.order - b.order))
      })
  }, [])

  const update = (i: number, patch: Partial<Marketplace>) => {
    setItems(prev => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m))
  }
  const remove = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, order: idx + 1 })))
  }
  const add = () => {
    setItems(prev => [...prev, { title: '', url: '', domain: '', description: '', order: prev.length + 1 }])
  }
  const move = (i: number, dir: -1 | 1) => {
    setItems(prev => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const copy = prev.slice()
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy.map((m, idx) => ({ ...m, order: idx + 1 }))
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/content/shop/marketplaces', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ marketplaces: items }),
      })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Collect</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Shop · Marketplaces</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />
      <p className="font-serif text-brand-night/70 max-w-2xl mb-6">
        Edit the external marketplace links shown on the public shop page. Changes save to Vercel Blob and are read by visitors immediately.
      </p>

      <div className="flex flex-col gap-6 max-w-3xl">
        {items.map((m, i) => (
          <div key={i} className="bg-white border border-brand-night/10 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">№ {String(i + 1).padStart(2, '0')}</span>
              <div className="flex gap-3 items-center">
                <button onClick={() => move(i, -1)} className="font-mono text-[10px] uppercase tracking-widest text-brand-night/60 hover:text-brand-night">↑</button>
                <button onClick={() => move(i, 1)} className="font-mono text-[10px] uppercase tracking-widest text-brand-night/60 hover:text-brand-night">↓</button>
                <button onClick={() => remove(i)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">Delete</button>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Title</label>
              <input value={m.title} onChange={e => update(i, { title: e.target.value })} className={inputCls} placeholder="Wallet Bubbles" />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">URL</label>
              <input value={m.url} onChange={e => update(i, { url: e.target.value })} className={inputCls} placeholder="https://…" />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Display domain</label>
              <input value={m.domain} onChange={e => update(i, { domain: e.target.value })} className={inputCls} placeholder="walletbubbles.com" />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1.5">Description</label>
              <textarea value={m.description} onChange={e => update(i, { description: e.target.value })} rows={3} className={inputCls + ' resize-none'} placeholder="One or two sentences." />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 items-center">
        <button onClick={add} className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">+ Add marketplace</button>
        <BrushButton onClick={save} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </BrushButton>
      </div>
    </div>
  )
}
