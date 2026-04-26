// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { readJSON, writeJSON } from '@/lib/blob'
import { Order, OrderIndex, OrderItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { resend } from '@/lib/resend'

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
    const parsedItems: OrderItem[] = JSON.parse(session.metadata?.items ?? '[]').map((item: Omit<OrderItem, 'imageUrl'>) => ({
      ...item,
      imageUrl: '',
    }))
    const items = parsedItems
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

    try {
      await resend.emails.send({
        from: 'faavidel.art <noreply@faavidel.art>',
        to: order.customerEmail,
        subject: `Order confirmed — faavidel.art`,
        html: `
      <h2>Thank you for your order, ${order.customerName}!</h2>
      <p>Your order <strong>#${order.id.slice(0, 8)}</strong> has been received and is being processed.</p>
      <p>We'll be in touch with shipping details soon.</p>
      <br>
      <p>— Faavidel</p>
    `,
      })
    } catch (emailErr) {
      // Don't fail the webhook if email fails
      console.error('Order confirmation email failed:', emailErr)
    }
  }

  return NextResponse.json({ received: true })
}
