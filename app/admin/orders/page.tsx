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
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-6">Orders</h1>
        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
          {orders.length === 0 && <p className="p-6 font-sans text-sm text-charcoal/40">No orders yet.</p>}
          {orders.map(o => (
            <button key={o.id} onClick={() => viewOrder(o.id)}
              className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-off-white transition-colors
                ${selected?.id === o.id ? 'bg-off-white' : ''}`}>
              <div>
                <p className="font-sans text-sm text-charcoal">{o.customerEmail}</p>
                <p className="font-sans text-xs text-charcoal/40 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm text-burnt">${o.total.toFixed(2)}</span>
                <span className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 rounded-full
                  ${o.status === 'paid' ? 'bg-seafoam/10 text-seafoam' : ''}
                  ${o.status === 'shipped' ? 'bg-ocean/10 text-ocean' : ''}
                  ${o.status === 'delivered' ? 'bg-green-50 text-green-600' : ''}
                  ${o.status === 'pending' ? 'bg-gray-100 text-gray-500' : ''}`}>
                  {o.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="bg-white rounded-lg border border-gray-100 p-5">
          <h2 className="font-serif text-lg text-charcoal mb-1">Order Detail</h2>
          <p className="font-sans text-xs text-charcoal/40 mb-4">#{selected.id.slice(-8)}</p>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-1">Customer</p>
            <p className="font-sans text-sm">{selected.customerName}</p>
            <p className="font-sans text-xs text-charcoal/60">{selected.customerEmail}</p>
          </div>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-1">Shipping</p>
            <p className="font-sans text-sm">{selected.shippingAddress.line1}</p>
            <p className="font-sans text-xs text-charcoal/60">
              {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Items</p>
            {selected.items.map((item, i) => (
              <div key={i} className="flex justify-between font-sans text-sm py-1 border-b border-gray-50">
                <span>{item.productTitle} × {item.quantity}</span>
                <span className="text-burnt">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-sans text-sm font-medium mt-2 pt-1">
              <span>Total</span>
              <span className="text-burnt">${selected.total.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider mb-2">Update Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['pending', 'paid', 'shipped', 'delivered'] as const).map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className={`font-sans text-xs uppercase tracking-wider px-3 py-1.5 rounded border transition-colors
                    ${selected.status === s ? 'bg-ocean text-white border-ocean' : 'border-gray-200 text-charcoal/60 hover:border-ocean'}`}>
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
