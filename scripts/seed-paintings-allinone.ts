// scripts/seed-paintings-allinone.ts
//
// Add every .jpg in SOURCE_DIR to the gallery.
// - Title = filename without extension (e.g. "441 years later 2024")
// - Year  = trailing 4-digit number in the filename
// - Slug  = slugified title
// - Merges with the existing content/gallery/index.json (does not wipe).
//
// Run: BLOB_READ_WRITE_TOKEN=<token> npx tsx scripts/seed-paintings-allinone.ts [sourceDir]

import { put, list } from '@vercel/blob'
import fs from 'node:fs/promises'
import path from 'node:path'

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

interface IndexEntry {
  slug: string
  title: string
  imageUrl: string
  tags: string[]
  order: number
}

const DEFAULT_SOURCE = '/Users/rezasahebozamani/Downloads/All in one Faavi'
const SOURCE_DIR = process.argv[2] || DEFAULT_SOURCE

const slugify = (s: string) => s
  .toLowerCase()
  .replace(/['"`]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

async function readJSONBlob<T>(pathname: string): Promise<T | null> {
  const blobs = await list({ prefix: pathname })
  const match = blobs.blobs.find(b => b.pathname === pathname)
  if (!match) return null
  const res = await fetch(match.url, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

async function uploadImageIfMissing(slug: string, filePath: string): Promise<string> {
  const target = `gallery/${slug}.jpg`
  const existing = await list({ prefix: target })
  const hit = existing.blobs.find(b => b.pathname === target)
  if (hit) return hit.url
  const buf = await fs.readFile(filePath)
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

  const files = (await fs.readdir(SOURCE_DIR))
    .filter(f => /\.jpe?g$/i.test(f))
    .sort()

  if (files.length === 0) {
    console.error(`no .jpg files in ${SOURCE_DIR}`)
    process.exit(1)
  }

  const existing = await readJSONBlob<{ artworks: IndexEntry[] }>('content/gallery/index.json')
  const existingArtworks: IndexEntry[] = existing?.artworks ?? []
  const existingBySlug = new Map(existingArtworks.map(a => [a.slug, a]))
  let nextOrder = existingArtworks.reduce((m, a) => Math.max(m, a.order ?? 0), 0) + 1

  const newArtworks: Artwork[] = []
  const seen = new Set<string>()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(SOURCE_DIR, file)
    const base = file.replace(/\.jpe?g$/i, '')
    const yearMatch = base.match(/(20\d{2})\s*$/)
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear()
    const title = base

    let slug = slugify(title)
    let n = 2
    while (seen.has(slug)) { slug = `${slugify(title)}-${n++}` }
    seen.add(slug)

    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${files.length}] ${slug} … `)
    const blobUrl = await uploadImageIfMissing(slug, filePath)

    const prior = existingBySlug.get(slug)
    const order = prior?.order ?? nextOrder++

    newArtworks.push({
      slug,
      title,
      description: '',
      tags: ['painting', String(year)],
      imageUrl: blobUrl,
      year,
      order,
      createdAt: new Date().toISOString(),
    })
    console.log('ok')
  }

  for (const a of newArtworks) {
    await put(`content/gallery/${a.slug}.json`, JSON.stringify(a, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  }

  const newSlugs = new Set(newArtworks.map(a => a.slug))
  const merged: IndexEntry[] = [
    ...existingArtworks.filter(a => !newSlugs.has(a.slug)),
    ...newArtworks.map(a => ({
      slug: a.slug,
      title: a.title,
      imageUrl: a.imageUrl,
      tags: a.tags,
      order: a.order,
    })),
  ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  await put('content/gallery/index.json', JSON.stringify({ artworks: merged }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  console.log(`seeded ${newArtworks.length} paintings (${merged.length} total in index)`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
