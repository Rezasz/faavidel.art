import { readJSON } from '@/lib/blob'
import { GalleryIndex, OrderIndex, PostIndex, ProductIndex } from '@/lib/types'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  const [gallery, posts, orders, products] = await Promise.all([
    readJSON<GalleryIndex>('gallery/index.json'),
    readJSON<PostIndex>('writing/index.json'),
    readJSON<OrderIndex>('orders/index.json'),
    readJSON<ProductIndex>('shop/index.json'),
  ])

  const stats = [
    { label: 'Artworks', value: gallery?.artworks.length ?? 0, href: '/admin/gallery' },
    { label: 'Posts', value: posts?.posts.filter(p => p.status === 'published').length ?? 0, href: '/admin/writing' },
    { label: 'Products', value: products?.products.filter(p => p.status === 'active').length ?? 0, href: '/admin/shop' },
    { label: 'Orders', value: orders?.orders.length ?? 0, href: '/admin/orders' },
  ]

  const recentOrders = orders?.orders.slice(0, 5) ?? []

  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">Overview</p>
      <h1 className="font-serif italic text-3xl text-brand-night mt-1 mb-2">Dashboard</h1>
      <div className="w-12 h-px bg-brand-amber/60 mb-8" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white p-5 border border-brand-night/10 hover:border-brand-iris transition-colors">
            <p className="font-serif text-3xl text-brand-iris mb-1">{s.value}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55">{s.label}</p>
          </Link>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="font-serif italic text-xl text-brand-night mb-3">Recent Orders</h2>
          <div className="bg-white border border-brand-night/10 divide-y divide-brand-night/10">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-serif text-sm text-brand-night">{order.customerEmail}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-brand-night/55 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-brand-amber">${order.total.toFixed(2)}</span>
                  <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5
                    ${order.status === 'paid' ? 'bg-brand-amber text-brand-night' : ''}
                    ${order.status === 'shipped' ? 'bg-brand-iris text-brand-cream' : ''}
                    ${order.status === 'pending' ? 'bg-brand-night/10 text-brand-night/55' : ''}
                    ${order.status === 'delivered' ? 'bg-brand-iris/20 text-brand-iris' : ''}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
