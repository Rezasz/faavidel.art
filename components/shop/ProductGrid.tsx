import ProductCard from './ProductCard'
import { ProductIndex } from '@/lib/types'

export default function ProductGrid({ products }: { products: ProductIndex['products'] }) {
  const active = products.filter(p => p.status === 'active')
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {active.map((product, i) => (
        <ProductCard key={product.slug} product={product} index={i} />
      ))}
    </div>
  )
}
