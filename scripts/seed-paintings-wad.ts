// scripts/seed-paintings-wad.ts
import { put, list } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

interface InputPainting { title: string; url: string }
interface Artwork {
  slug: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  year: number
  order: number
  createdAt: string
}

const slugify = (s: string) => s
  .toLowerCase()
  .replace(/['"`]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

async function uploadIfMissing(slug: string, sourceUrl: string): Promise<string> {
  const target = `gallery/${slug}.jpg`
  const existing = await list({ prefix: target })
  const hit = existing.blobs.find(b => b.pathname === target)
  if (hit) return hit.url

  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`fetch ${sourceUrl} failed: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const result = await put(target, buf, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
  })
  return result.url
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is required')
    process.exit(1)
  }

  const file = path.resolve('scripts/artworks-wad2026.json')
  const inputs: InputPainting[] = JSON.parse(await fs.readFile(file, 'utf8'))

  const seen = new Set<string>()
  const artworks: Artwork[] = []

  for (let i = 0; i < inputs.length; i++) {
    const p = inputs[i]
    let slug = slugify(p.title)
    let n = 2
    while (seen.has(slug)) { slug = `${slugify(p.title)}-${n++}` }
    seen.add(slug)

    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${inputs.length}] ${slug} … `)
    const blobUrl = await uploadIfMissing(slug, p.url)
    artworks.push({
      slug,
      title: p.title,
      description: '',
      tags: ['painting', '2024', 'wad-2026'],
      imageUrl: blobUrl,
      year: 2024,
      order: i + 1,
      createdAt: new Date().toISOString(),
    })
    console.log('ok')
  }

  // per-artwork blobs at content/gallery/<slug>.json
  for (const a of artworks) {
    await put(`content/gallery/${a.slug}.json`, JSON.stringify(a, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  }

  // index at content/gallery.json
  const index = {
    artworks: artworks.map(a => ({
      slug: a.slug,
      title: a.title,
      imageUrl: a.imageUrl,
      tags: a.tags,
      order: a.order,
    })),
  }
  await put('content/gallery/index.json', JSON.stringify(index, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  console.log(`seeded ${artworks.length} paintings`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
