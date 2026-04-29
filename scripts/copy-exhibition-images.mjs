// scripts/copy-exhibition-images.mjs
// Copies pre-rendered PDF page images from /tmp/exhibitions-pdf/page-NN.jpg into
// public/exhibitions/<slug>.jpg, where slug is derived from each entry's title.
// Idempotent: skips destinations that already exist.
//
// Run with:  node scripts/copy-exhibition-images.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const data = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'scripts/exhibitions-data.json'), 'utf8'),
)
const srcDir = '/tmp/exhibitions-pdf'
const dstDir = path.join(projectRoot, 'public/exhibitions')
fs.mkdirSync(dstDir, { recursive: true })

let copied = 0
let skipped = 0
const missing = []

for (const e of data) {
  const slug = slugify(e.title)
  const pageNum = String(e.sourcePage).padStart(2, '0')
  const src = path.join(srcDir, `page-${pageNum}.jpg`)
  const dst = path.join(dstDir, `${slug}.jpg`)
  if (fs.existsSync(dst)) { skipped++; continue }
  if (!fs.existsSync(src)) { missing.push({ title: e.title, src }); continue }
  fs.copyFileSync(src, dst)
  copied++
  console.log(`  ${slug}.jpg <- page-${pageNum}.jpg (${e.title})`)
}

console.log(`\nCopied: ${copied}, Skipped (existed): ${skipped}, Missing: ${missing.length}`)
if (missing.length) console.log(JSON.stringify(missing, null, 2))
