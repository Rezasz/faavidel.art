'use client'
import { useEffect, useState } from 'react'
import { ProductIndex, Product } from '@/lib/types'
import FileUpload from '@/components/admin/FileUpload'
import BrushButton from '@/components/atmosphere/BrushButton'
import { Trash2 } from 'lucide-react'

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
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Store</p>
          <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Shop</h1>
          <div className="w-12 h-px bg-brand-amber/60" />
        </div>
        <BrushButton onClick={() => { setForm(emptyProduct()); setEditing(true) }}>
          + Add Product
        </BrushButton>
      </div>
      {editing && (
        <div className="bg-white border border-brand-night/10 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Product title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <input placeholder="Price (USD)" type="number" step="0.01" value={form.price ?? ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <input placeholder="Stock quantity" type="number" value={form.stock ?? ''} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2" />
            <select value={form.status ?? 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'archived' }))}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <textarea placeholder="Description" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="bg-transparent border-b border-brand-night/30 font-serif text-brand-night focus:outline-none focus:border-brand-iris transition-colors py-2 col-span-2 resize-none" />
          </div>
          <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-2">Product Images</p>
          <div className="flex gap-3 flex-wrap mb-3">
            {(form.images ?? []).map((img, i) => (
              <div key={img} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover border border-brand-night/20" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-brand-rose text-brand-cream rounded-full w-4 h-4 text-[10px] flex items-center justify-center">×</button>
              </div>
            ))}
            <FileUpload onUploaded={addImage} label="Add image" />
          </div>
          <div className="flex gap-3 items-center">
            <BrushButton onClick={save} disabled={saving || !form.title || !form.price}>
              {saving ? 'Saving…' : 'Save'}
            </BrushButton>
            <button onClick={() => { setEditing(false); setForm(emptyProduct()) }}
              className="font-mono text-[10px] uppercase tracking-widest text-brand-night/55 hover:text-brand-night transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
        {products.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No products yet.</p>}
        {products.map(p => (
          <div key={p.slug} className="flex items-center gap-4 px-5 py-3">
            {p.images[0] && <img src={p.images[0]} alt={p.title} className="w-12 h-12 object-cover" />}
            <div className="flex-1">
              <p className="font-serif text-sm text-brand-night">{p.title}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-brand-amber mt-0.5">${p.price.toFixed(2)} · {p.stock} in stock</p>
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5
              ${p.status === 'active' ? 'bg-brand-amber text-brand-night' : 'bg-brand-night/10 text-brand-night/55'}`}>
              {p.status}
            </span>
            <button onClick={() => startEdit(p.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-iris hover:text-brand-night transition-colors">Edit</button>
            <button onClick={() => remove(p.slug)} className="font-mono text-[10px] uppercase tracking-widest text-brand-rose hover:text-brand-night transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
