// app/api/content/[...path]/route.ts
import { auth } from '@/lib/auth'
import { readJSON, writeJSON, deleteBlob } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = path.join('/') + '.json'

  if (filePath.startsWith('orders/')) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await readJSON(filePath)
  if (data === null) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await params
  const filePath = path.join('/') + '.json'
  const body = await req.json()
  await writeJSON(filePath, body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await params
  const filePath = path.join('/') + '.json'
  await deleteBlob(filePath)
  return NextResponse.json({ ok: true })
}
