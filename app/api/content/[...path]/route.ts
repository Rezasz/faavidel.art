// app/api/content/[...path]/route.ts
import { auth } from '@/lib/auth'
import { readJSON, writeJSON, deleteBlob } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

function revalidateForFile(filePath: string) {
  const stripped = filePath.replace(/\.json$/, '')
  const [top, sub] = stripped.split('/')
  const targets = new Set<string>()

  switch (top) {
    case 'writing':
      targets.add('/writing'); targets.add('/')
      if (sub && sub !== 'index') targets.add(`/writing/${sub}`)
      break
    case 'gallery':
      targets.add('/gallery'); targets.add('/')
      if (sub && sub !== 'index') targets.add(`/gallery/${sub}`)
      break
    case 'exhibitions':
      targets.add('/exhibitions')
      break
    case 'about':
      targets.add('/about'); targets.add('/')
      break
    case 'homepage':
    case 'settings':
      targets.add('/')
      break
    case 'shop':
      targets.add('/shop')
      break
    case 'music':
      targets.add('/music')
      break
  }

  for (const p of targets) revalidatePath(p)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/') + '.json'

  if (filePath.startsWith('orders/')) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE })
  }

  const data = await readJSON(filePath)
  if (data === null) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: NO_STORE })
  return NextResponse.json(data, { headers: NO_STORE })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE })

  const { path } = await params
  const filePath = path.join('/') + '.json'
  const body = await req.json()
  await writeJSON(filePath, body)
  revalidateForFile(filePath)
  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE })

  const { path } = await params
  const filePath = path.join('/') + '.json'
  await deleteBlob(filePath)
  revalidateForFile(filePath)
  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}
