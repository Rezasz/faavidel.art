// app/api/upload/route.ts
import { auth } from '@/lib/auth'
import { uploadMedia } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const rawPathname = formData.get('pathname') as string | null

  if (!rawPathname || !/^[\w.\-]+$/.test(rawPathname)) {
    return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
  }

  if (!file) {
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 })
  }

  const url = await uploadMedia(file, rawPathname, file.type)
  return NextResponse.json({ url })
}
