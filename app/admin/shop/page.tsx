'use client'
import { useEffect, useState } from 'react'
import { ProductIndex, Product } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import { Plus, Trash2 } from 'lucide-react'

const emptyProduct = (): Partial<Product> => ({
  title: '', description: '', price: 0, images: [], stock: 1, status: 'active',
})

export default function AdminShopPage() {
  const [products, setProducts] = useState<ProductIndex['products']>([])
  const [form, setForm] = useState<Partial<Product>>(emptyProduct())
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () =>
    fetch('/api/content/shop/index').then(r => r.ok ? r.json() : null).then(d => setProducts(d?.products ?? []))

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const slug = (form.slug ?? form.title!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) || 'product'
      const product: Product = {
        slug,
        title: form.title!,
        description: form.description ?? '',
        price: Number(form.price),
        images: form.images ?? [],
        stock: Number(form.stock),
        status: (form.status as 'active' | 'archived') ?? 'active',
        createdAt: form.createdAt ?? new Date().toISOString(),
      }
      await fetch(`/api/content/shop/${slug}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(product),
      })
      const existing = products.find(p => p.slug === slug)
      const summary = { slug, title: product.title, price: product.price, images: product.images, stock: product.stock, status: product.status }
      const updated: ProductIndex = {
        products: existing ? products.map(p => p.slug === slug ? summary : p) : [...products, summary]
      }
      await fetch('/api/content/shop/index', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(updated),
      })
      await load()
      setForm(emptyProduct())
      setEditing(false)
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (slug: string) => {
    if (!confirm('Delete this product?')) return
    try {
      await fetch('/api/content/shop/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ products: products.filter(p => p.slug !== slug) }),
      })
      await load()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const startEdit = async (slug: string) => {
    const res = await fetch(`/api/content/shop/${slug}`)
    if (!res.ok) return
    setForm(await res.json())
    setEditing(true)
  }

  const addImage = (url: string) => setForm(f => ({ ...f, images: [...(f.images ?? []), url] }))
  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images?.filter((_, j) => j !== i) }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Shop</h1>
        <button onClick={() => { setForm(emptyProduct()); setEditing(true) }}
          className="flex items-center gap-2 bg-ocean text-white font-sans text-xs tracking-wider uppercase px-4 py-2 rounded">
          <Plus size={14} /> Add Product
        </button>
      </div>
      {editing && (
        <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Product title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Price (USD)" type="number" step="0.01" value={form.price ?? ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <input placeholder="Stock quantity" type="number" value={form.stock ?? ''} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam" />
            <select value={form.status ?? 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'archived' }))}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam bg-white">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="border border-gray-200 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-seafoam col-span-2 resize-none" />
          </div>
          <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Product Images</p>
          <div className="flex gap-3 flex-wrap mb-3">
            {(form.images ?? []).map((img, i) => (
              <div key={img} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded border border-gray-200" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-burnt text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">×</button>
              </div>
            ))}
            <FileUpload onUploaded={addImage} label="Add image" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.title || !form.price}
              className="bg-burnt text-white font-sans text-xs uppercase tracking-wider px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm(emptyProduct()) }}
              className="border border-gray-200 text-charcoal/60 font-sans text-xs px-5 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {products.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No products yet.</p>}
        {products.map(p => (
          <div key={p.slug} className="flex items-center gap-4 px-5 py-3">
            {p.images[0] && <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-sans text-sm text-charcoal">{p.title}</p>
              <p className="font-sans text-xs text-burnt mt-0.5">${p.price.toFixed(2)} · {p.stock} in stock</p>
            </div>
            <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
              ${p.status === 'active' ? 'bg-seafoam/10 text-seafoam' : 'bg-gray-100 text-gray-400'}`}>
              {p.status}
            </span>
            <button onClick={() => startEdit(p.slug)} className="font-sans text-xs text-ocean hover:underline">Edit</button>
            <button onClick={() => remove(p.slug)} className="text-charcoal/30 hover:text-burnt"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
