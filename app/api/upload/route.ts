// app/api/upload/route.ts
import { auth } from '@/lib/auth'
import { uploadMedia } from '@/lib/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const pathname = formData.get('pathname') as string | null

  if (!file || !pathname) {
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 })
  }

  const url = await uploadMedia(file, pathname, file.type)
  return NextResponse.json({ url })
}
