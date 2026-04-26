// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { readJSON, writeJSON } from '@/lib/blob'
import { Order, OrderIndex, OrderItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const items: OrderItem[] = JSON.parse(session.metadata?.items ?? '[]')
    const shipping = session.collected_information?.shipping_details?.address

    const order: Order = {
      id: session.id,
      items,
      customerEmail: session.customer_details?.email ?? '',
      customerName: session.customer_details?.name ?? '',
      shippingAddress: {
        line1: shipping?.line1 ?? '',
        line2: shipping?.line2 ?? undefined,
        city: shipping?.city ?? '',
        state: shipping?.state ?? '',
        postalCode: shipping?.postal_code ?? '',
        country: shipping?.country ?? '',
      },
      total: (session.amount_total ?? 0) / 100,
      status: 'paid',
      stripeSessionId: session.id,
      createdAt: new Date().toISOString(),
    }

    await writeJSON(`orders/${order.id}.json`, order)

    const index = (await readJSON<OrderIndex>('orders/index.json')) ?? { orders: [] }
    index.orders.unshift({
      id: order.id,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    })
    await writeJSON('orders/index.json', index)
  }

  return NextResponse.json({ received: true })
}
