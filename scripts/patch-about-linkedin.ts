/* One-off: ensure LinkedIn (and any missing default field) is present in
 * content/about.json on Vercel Blob. Idempotent — safe to re-run.
 *
 *   BLOB_READ_WRITE_TOKEN=… npx tsx scripts/patch-about-linkedin.ts
 */
import { list, put } from '@vercel/blob'
import type { AboutContent } from '../lib/types'

const KEY = 'content/about.json'

const defaults: AboutContent = {
  fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.',
  profilePhotoUrl: '/about/portrait.jpg',
  instagram: 'https://www.instagram.com/faa.videl',
  email: 'info@faavidel.art',
  whatsapp: '+971555895441',
  linktree: 'https://linktr.ee/faavidel',
  linkedin: 'https://www.linkedin.com/in/faavidel-68843a144/',
}

async function main() {
  const blobs = await list({ prefix: KEY })
  const match = blobs.blobs.find(b => b.pathname === KEY)

  let current: Partial<AboutContent> = {}
  if (match) {
    const res = await fetch(match.url, { cache: 'no-store' })
    if (res.ok) current = (await res.json()) as Partial<AboutContent>
  }

  const merged: AboutContent = { ...defaults, ...current, linkedin: defaults.linkedin }

  await put(KEY, JSON.stringify(merged, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  console.log('Wrote', KEY, '— linkedin:', merged.linkedin)
}

main().catch(err => { console.error(err); process.exit(1) })
