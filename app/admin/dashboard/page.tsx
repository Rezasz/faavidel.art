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
      <h1 className="font-serif text-2xl text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-lg p-5 border border-gray-100 hover:border-seafoam transition-colors">
            <p className="font-sans text-3xl font-light text-ocean mb-1">{s.value}</p>
            <p className="font-sans text-xs tracking-wider uppercase text-charcoal/50">{s.label}</p>
          </Link>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="font-serif text-lg text-charcoal mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-sans text-sm text-charcoal">{order.customerEmail}</p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-sm text-burnt">${order.total.toFixed(2)}</span>
                  <span className={`font-sans text-xs tracking-wider uppercase px-2 py-0.5 rounded-full
                    ${order.status === 'paid' ? 'bg-seafoam/10 text-seafoam' : ''}
                    ${order.status === 'shipped' ? 'bg-ocean/10 text-ocean' : ''}
                    ${order.status === 'pending' ? 'bg-gray-100 text-gray-500' : ''}
                    ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : ''}`}>
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
