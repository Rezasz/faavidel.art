// app/api/contact/route.ts
import { resend } from '@/lib/resend'
import { readJSON } from '@/lib/blob'
import { SiteSettings } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const settings = await readJSON<SiteSettings>('site.json')
  const to = settings?.contactEmail ?? 'hello@faavidel.art'

  await resend.emails.send({
    from: 'faavidel.art <noreply@faavidel.art>',
    to,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  return NextResponse.json({ ok: true })
}
