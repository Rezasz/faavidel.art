// Run with: npx tsx scripts/seed.ts
import { put } from '@vercel/blob'

const seed = async (path: string, data: unknown) => {
  const content = JSON.stringify(data, null, 2)
  await put(`content/${path}`, content, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })
  console.log(`✓ Seeded ${path}`)
}

async function main() {
  await seed('site.json', {
    siteTitle: 'faavidel.art',
    siteDescription: 'A multidisciplinary creative portfolio — art, photography, music, and writing.',
    contactEmail: 'hello@faavidel.art',
    metaImage: '',
  })
  await seed('homepage.json', {
    heroTitle: 'faavidel',
    heroSubtitle: 'A world of creative work',
    heroButtonText: 'Explore the Gallery',
    featuredArtworkSlugs: [],
    bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing. Every piece is an exploration of memory, nature, and emotion.',
  })
  await seed('about.json', {
    fullBio: 'A multidisciplinary artist working across painting, photography, music, and writing.\n\nEvery piece begins as a question and ends somewhere unexpected.',
    profilePhotoUrl: '',
    instagram: '',
    email: 'hello@faavidel.art',
  })
  await seed('gallery/index.json', { artworks: [] })
  await seed('photography/index.json', { series: [] })
  await seed('writing/index.json', { posts: [] })
  await seed('video/index.json', { videos: [] })
  await seed('music/index.json', { tracks: [] })
  await seed('shop/index.json', { products: [] })
  await seed('orders/index.json', { orders: [] })
  console.log('\n✅ All content seeded successfully.')
}

main().catch(console.error)
