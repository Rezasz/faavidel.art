// app/api/checkout/route.ts
import { stripe } from '@/lib/stripe'
import { CartItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json()

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 })
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: { productSlug: item.productSlug },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE'],
    },
    success_url: `${process.env.NEXTAUTH_URL}/shop?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/shop`,
    metadata: {
      items: JSON.stringify(
        items.map(({ imageUrl: _, title, ...rest }) => ({
          ...rest,
          productTitle: title,
        }))
      ),
    },
  })

  return NextResponse.json({ url: session.url })
}
