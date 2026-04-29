'use client'
import { useEffect, useState } from 'react'
import { OrderIndex, Order } from '@/lib/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderIndex['orders']>([])
  const [selected, setSelected] = useState<Order | null>(null)

  const load = () =>
    fetch('/api/content/orders/index').then(r => r.ok ? r.json() : null).then(d => setOrders(d?.orders ?? []))

  useEffect(() => { load() }, [])

  const viewOrder = async (id: string) => {
    const res = await fetch(`/api/content/orders/${id}`)
    if (res.ok) setSelected(await res.json())
  }

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/content/orders/${id}`)
      if (!res.ok) return
      const order: Order = await res.json()
      await fetch(`/api/content/orders/${id}`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...order, status }),
      })
      const updatedIndex = { orders: orders.map(o => o.id === id ? { ...o, status } : o) }
      await fetch('/api/content/orders/index', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedIndex),
      })
      setOrders(updatedIndex.orders)
      if (selected?.id === id) setSelected(o => o ? { ...o, status } : o)
    } catch (err) {
      console.error('Update status error:', err)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Sales</p>
        <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Orders</h1>
        <div className="w-12 h-px bg-brand-amber/60 mb-8" />
        <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
          {orders.length === 0 && <p className="p-6 font-serif text-sm text-brand-night/40">No orders yet.</p>}
          {orders.map(o => (
            <button key={o.id} onClick={() => viewOrder(o.id)}
              className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-brand-parchment transition-colors
                ${selected?.id === o.id ? 'bg-brand-parchment' : ''}`}>
              <div>
                <p className="font-serif text-sm text-brand-night">{o.customerEmail}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-brand-amber">${o.total.toFixed(2)}</span>
                <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5
                  ${o.status === 'paid' ? 'bg-brand-amber text-brand-night' : ''}
                  ${o.status === 'shipped' ? 'bg-brand-iris text-brand-cream' : ''}
                  ${o.status === 'delivered' ? 'bg-brand-iris/20 text-brand-iris' : ''}
                  ${o.status === 'pending' ? 'bg-brand-night/10 text-brand-night/55' : ''}`}>
                  {o.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="bg-white border border-brand-night/10 p-5">
          <h2 className="font-serif italic text-xl text-brand-night mb-1">Order Detail</h2>
          <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/40 mb-4">#{selected.id.slice(-8)}</p>
          <div className="mb-4">
            <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1">Customer</p>
            <p className="font-serif text-sm text-brand-night">{selected.customerName}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/70">{selected.customerEmail}</p>
          </div>
          <div className="mb-4">
            <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-1">Shipping</p>
            <p className="font-serif text-sm text-brand-night">{selected.shippingAddress.line1}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/70">
              {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}
            </p>
          </div>
          <div className="mb-4">
            <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-2">Items</p>
            {selected.items.map((item, i) => (
              <div key={i} className="flex justify-between font-serif text-sm py-1 border-b border-brand-night/10">
                <span>{item.productTitle} × {item.quantity}</span>
                <span className="text-brand-amber font-mono">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-serif text-sm font-medium mt-2 pt-1">
              <span>Total</span>
              <span className="text-brand-amber font-mono">${selected.total.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <p className="block font-mono text-[10px] tracking-widest uppercase text-brand-night/65 mb-2">Update Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['pending', 'paid', 'shipped', 'delivered'] as const).map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors
                    ${selected.status === s ? 'bg-brand-iris text-brand-cream border-brand-iris' : 'border-brand-night/20 text-brand-night/70 hover:border-brand-iris'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
