// Run with: npx tsx scripts/seed-demo.ts
// Seeds rich demo content into Vercel Blob for preview/testing
import { put } from '@vercel/blob'

const seed = async (path: string, data: unknown) => {
  const content = JSON.stringify(data, null, 2)
  await put(`content/${path}`, content, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  console.log(`✓ Seeded ${path}`)
}

async function main() {
  // ── Site settings ─────────────────────────────────────────────
  await seed('site.json', {
    siteTitle: 'faavidel.art',
    siteDescription: 'A multidisciplinary creative portfolio — art, photography, music, and writing.',
    contactEmail: 'hello@faavidel.art',
    metaImage: 'https://picsum.photos/seed/faavidel/1200/630',
  })

  // ── Homepage ──────────────────────────────────────────────────
  await seed('homepage.json', {
    heroTitle: 'faavidel',
    heroSubtitle: 'Art · Photography · Music · Writing',
    heroButtonText: 'Explore the Gallery',
    featuredArtworkSlugs: ['ocean-reverie', 'ember-study-ii', 'night-bloom'],
    bioSnippet: 'A multidisciplinary artist working across painting, photography, music, and writing. Every piece is an exploration of memory, nature, and emotion.',
  })

  // ── About ─────────────────────────────────────────────────────
  await seed('about.json', {
    fullBio: `I am a multidisciplinary artist whose practice spans painting, photography, music composition, and writing. My work is rooted in the intersections between the natural world and human memory — the way a particular quality of light can collapse time, or how a sound can reconstruct a place that no longer exists.

I grew up between coastlines and forests, and that landscape still inhabits everything I make. The ocean series began as a study of color, and became something closer to a record of grief. The photographs started as documentation and became their own form of invention.

I work slowly. Most pieces take months. I believe in the value of uncertainty — in not knowing what something is until it tells you.

Currently based between studios in the city and a small house near the water.`,
    profilePhotoUrl: 'https://picsum.photos/seed/portrait/600/600',
    instagram: '@faavidel',
    email: 'hello@faavidel.art',
    twitter: '@faavidel',
  })

  // ── Gallery ───────────────────────────────────────────────────
  const artworks = [
    {
      slug: 'ocean-reverie',
      title: 'Ocean Reverie',
      description: 'A meditative study of deep water blues — the painting explores the threshold between surface and depth, calm and turbulence. Mixed media on linen.',
      tags: ['painting', 'ocean', 'mixed media'],
      imageUrl: 'https://picsum.photos/seed/ocean1/900/700',
      year: 2024,
      order: 1,
      createdAt: '2024-09-15T10:00:00Z',
    },
    {
      slug: 'ember-study-ii',
      title: 'Ember Study II',
      description: 'Second in a series of fire-light studies. The warm tones push against the cool ground, creating a tension that mirrors internal states of longing.',
      tags: ['painting', 'fire', 'study'],
      imageUrl: 'https://picsum.photos/seed/ember2/900/700',
      year: 2024,
      order: 2,
      createdAt: '2024-08-02T10:00:00Z',
    },
    {
      slug: 'night-bloom',
      title: 'Night Bloom',
      description: 'Nocturnal botanical forms rendered in ink and pale gold. Plants observed in darkness, illuminated only by a single lamp.',
      tags: ['ink', 'botanical', 'illustration'],
      imageUrl: 'https://picsum.photos/seed/nightbloom/900/700',
      year: 2024,
      order: 3,
      createdAt: '2024-07-10T10:00:00Z',
    },
    {
      slug: 'drift',
      title: 'Drift',
      description: 'Abstract field painting. Gestural marks in charcoal blue and seafoam on a warm ground. The composition arrived quickly; the title took months.',
      tags: ['abstract', 'painting', 'charcoal'],
      imageUrl: 'https://picsum.photos/seed/drift4/900/700',
      year: 2023,
      order: 4,
      createdAt: '2023-11-20T10:00:00Z',
    },
    {
      slug: 'cartography-of-loss',
      title: 'Cartography of Loss',
      description: 'Maps that document no real geography. Ink, gold leaf, and archival pigment on paper. Part of an ongoing series investigating memory as landscape.',
      tags: ['mixed media', 'map', 'gold leaf'],
      imageUrl: 'https://picsum.photos/seed/carto5/900/700',
      year: 2023,
      order: 5,
      createdAt: '2023-06-05T10:00:00Z',
    },
    {
      slug: 'salt-flat-study',
      title: 'Salt Flat Study',
      description: 'Three panels. The horizon as a vanishing argument. Oil on board.',
      tags: ['oil', 'landscape', 'triptych'],
      imageUrl: 'https://picsum.photos/seed/saltflat/900/700',
      year: 2023,
      order: 6,
      createdAt: '2023-03-18T10:00:00Z',
    },
  ]

  await seed('gallery/index.json', {
    artworks: artworks.map(({ slug, title, imageUrl, tags, order }) => ({ slug, title, imageUrl, tags, order })),
  })
  for (const art of artworks) {
    await seed(`gallery/${art.slug}.json`, art)
  }

  // ── Photography ───────────────────────────────────────────────
  const series = [
    {
      slug: 'coast-light',
      title: 'Coast Light',
      description: 'A year photographing the same stretch of coastline across seasons. The light never repeated itself.',
      coverUrl: 'https://picsum.photos/seed/coast-cover/800/600',
      order: 1,
      createdAt: '2024-01-01T10:00:00Z',
      photos: [
        { id: 'cl-1', url: 'https://picsum.photos/seed/coast1/1200/800', caption: 'January, low tide', order: 1 },
        { id: 'cl-2', url: 'https://picsum.photos/seed/coast2/1200/800', caption: 'March, storm light', order: 2 },
        { id: 'cl-3', url: 'https://picsum.photos/seed/coast3/1200/800', caption: 'June, solstice evening', order: 3 },
        { id: 'cl-4', url: 'https://picsum.photos/seed/coast4/1200/800', caption: 'August, heat haze', order: 4 },
        { id: 'cl-5', url: 'https://picsum.photos/seed/coast5/1200/800', caption: 'October, first rain', order: 5 },
      ],
    },
    {
      slug: 'interior-studies',
      title: 'Interior Studies',
      description: 'Rooms, corners, and objects. An investigation into how space holds memory.',
      coverUrl: 'https://picsum.photos/seed/interior-cover/800/600',
      order: 2,
      createdAt: '2023-06-01T10:00:00Z',
      photos: [
        { id: 'is-1', url: 'https://picsum.photos/seed/interior1/1200/900', caption: 'Studio, morning', order: 1 },
        { id: 'is-2', url: 'https://picsum.photos/seed/interior2/1200/900', caption: 'Kitchen table, late afternoon', order: 2 },
        { id: 'is-3', url: 'https://picsum.photos/seed/interior3/1200/900', caption: 'Window, rain', order: 3 },
        { id: 'is-4', url: 'https://picsum.photos/seed/interior4/1200/900', caption: 'Bookshelves', order: 4 },
      ],
    },
    {
      slug: 'field-notes',
      title: 'Field Notes',
      description: 'Photographs taken during long walks. No predetermined subject — only attention.',
      coverUrl: 'https://picsum.photos/seed/field-cover/800/600',
      order: 3,
      createdAt: '2023-01-15T10:00:00Z',
      photos: [
        { id: 'fn-1', url: 'https://picsum.photos/seed/field1/1200/800', caption: 'Abandoned greenhouse', order: 1 },
        { id: 'fn-2', url: 'https://picsum.photos/seed/field2/1200/800', caption: 'Roadside flowers', order: 2 },
        { id: 'fn-3', url: 'https://picsum.photos/seed/field3/1200/800', caption: 'Fog, early morning', order: 3 },
      ],
    },
  ]

  await seed('photography/index.json', {
    series: series.map(({ slug, title, coverUrl, order }) => ({ slug, title, coverUrl, order })),
  })
  for (const s of series) {
    await seed(`photography/${s.slug}/index.json`, s)
  }

  // ── Writing ───────────────────────────────────────────────────
  const posts = [
    {
      slug: 'on-the-nature-of-creative-solitude',
      title: 'On the Nature of Creative Solitude',
      excerpt: 'Some thoughts on working alone, and why the silence is not empty.',
      content: `There is a particular quality of silence in a studio at 6am. The city hasn't started yet. The light is still deciding what it wants to be.

I have worked alone for most of my adult life. Not from preference, exactly — more from necessity. The work requires a specific state of attention that is difficult to maintain in the presence of others. Not because others are a disturbance, but because attention is a finite thing, and once given in one direction, it is no longer available in another.

## The Myth of Inspiration

People often ask where ideas come from, as if ideas arrive like weather — sudden, external, unchosen. In my experience, they don't. Ideas are the residue of sustained attention. They emerge slowly from the practice of showing up and looking, day after day, at the same problems.

The studio is a container for this kind of looking. Its usefulness is precisely its limitation: it is a space in which almost nothing happens, so that the small things that do happen become visible.

## What Solitude Isn't

Solitude is not isolation. The work is always in conversation — with other work, with the natural world, with memory, with the specific quality of light on a specific afternoon. The studio is quiet but it is not sealed.

I read a great deal. I walk. I listen to music that has no words. These are the inputs. The work is the output. Between them: silence, and the slow accumulation of understanding.

## A Note on Time

The hardest thing I have learned is that good work cannot be hurried. This is not a romantic notion — it is a practical one. Rushing produces a certain kind of surface fluency that is completely hollow on inspection.

The pieces I am most satisfied with are the ones that resisted me for the longest. The ones that kept sending me back to the beginning.`,
      date: '2025-04-15',
      status: 'published' as const,
      tags: ['process', 'essay', 'studio'],
      createdAt: '2025-04-15T10:00:00Z',
    },
    {
      slug: 'what-the-ocean-taught-me-about-color',
      title: 'What the Ocean Taught Me About Color',
      excerpt: 'A year of painting the same water, and what changed.',
      content: `I spent a year painting the ocean. The same stretch of water, different light, different seasons, different hours of the day. By the end of it I thought I understood something about blue.

I didn't. But I understood something about looking.

## Blue Is Not a Color

This sounds like a provocation, but it's a practical observation. The ocean is blue in the way that a forest is green — which is to say, superficially and intermittently, and never in the way you expect.

The water I painted was, at various times: grey-green, near-black, pale as milk, warm amber at dusk, almost violet in certain winter lights. Blue appeared rarely, and when it did, it was never the same blue twice.

## The Problem with Memory

When we remember color, we remember a category, not a specific. Ask someone to recall the color of the ocean and they will say blue. Show them a painting and they will say yes, that's right — even if the water in the painting is something else entirely.

This is why painting from memory is so dangerous. Memory simplifies. It replaces the specific with the representative. A painting made from memory is a painting of what you thought you saw, not what you saw.

## What Changed

After a year of looking at the same water, I stopped seeing it as ocean. I started seeing it as a set of specific problems: this particular quality of reflected sky, this particular agitation of surface, this particular way the light entered the water at this particular hour.

The paintings got worse before they got better. Then they got better in a way that surprised me.

I think that's probably how it always goes.`,
      date: '2025-03-20',
      status: 'published' as const,
      tags: ['painting', 'color', 'reflection'],
      createdAt: '2025-03-20T10:00:00Z',
    },
    {
      slug: 'process-notes-the-ember-series',
      title: 'Process Notes: The Ember Series',
      excerpt: 'How a single painting became a series I didn\'t plan to make.',
      content: `The Ember series began as an accident. I was working on something else — a large landscape that wasn't going anywhere — and I knocked a lamp over. In the moment before I righted it, the light falling across the canvas was extraordinary.

I set the lamp back, finished the landscape (badly), and then spent three days trying to recreate that light.

## What I Was After

It wasn't the drama of the fallen light, exactly. It was something more specific: the way the warm source pushed against the cool ambient light of the room, creating a zone of tension along the edge of objects. The shadow side of a cup that is almost blue. The highlight that is almost orange.

This is ordinary, in photographic terms — mixed color temperature. But in paint it becomes a problem worth investigating.

## The Series

The first painting in the series was destroyed. The second was better. By the fifth I understood what I was doing. There are now sixteen paintings in the series, of which I consider nine successful.

The successful ones share a quality I find difficult to describe. The light in them is doing something other than illuminating — it is revealing, or proposing. The objects in the paintings feel present in a way that goes beyond their representation.

## What I Learned

Color temperature is a subject that could sustain a lifetime of work. I am not near the end of it. The Ember series is, I think, a beginning — a record of learning a specific problem, not a solution to it.`,
      date: '2025-02-10',
      status: 'published' as const,
      tags: ['process', 'painting', 'behind the work'],
      createdAt: '2025-02-10T10:00:00Z',
    },
    {
      slug: 'notes-on-attention',
      title: 'Notes on Attention',
      excerpt: 'Attention as a creative practice — and what it costs.',
      content: `Attention is not a given. It is a practice, and like all practices, it can be developed or depleted.

I have been thinking about this lately because I have been finding it harder to sustain. The usual suspects: screens, notifications, the ambient noise of being alive in this particular moment. But also something less obvious — the weight of accumulated context, the sense that everything is already interpreted before I reach it.

The antidote, I keep returning to, is slowness. Not as an affectation but as a method. Walking instead of driving. Looking at a single painting for twenty minutes instead of twenty paintings for one minute each. Cooking slowly. Reading slowly.

This is not productivity advice. I am not interested in optimizing attention for output. I am interested in attention as an end in itself — as a form of being present to things, which seems to me the only form of presence worth having.`,
      date: '2025-01-05',
      status: 'published' as const,
      tags: ['essay', 'attention', 'practice'],
      createdAt: '2025-01-05T10:00:00Z',
    },
  ]

  await seed('writing/index.json', {
    posts: posts.map(({ slug, title, excerpt, date, status, tags }) => ({ slug, title, excerpt, date, status, tags })),
  })
  for (const post of posts) {
    await seed(`writing/${post.slug}.json`, post)
  }

  // ── Video ─────────────────────────────────────────────────────
  await seed('video/index.json', {
    videos: [
      {
        id: 'v1',
        title: 'Studio Visit — Spring 2024',
        description: 'A short film documenting the making of the Ocean series. Filmed over three months in the studio and on location.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://picsum.photos/seed/video1/800/450',
        order: 1,
        createdAt: '2024-06-01T10:00:00Z',
      },
      {
        id: 'v2',
        title: 'Cartography of Loss — Process',
        description: 'Time-lapse and interview footage from the making of the map series. Approximately 12 minutes.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://picsum.photos/seed/video2/800/450',
        order: 2,
        createdAt: '2024-02-14T10:00:00Z',
      },
      {
        id: 'v3',
        title: 'Coast Light — Year in Review',
        description: 'Edit of photographs from the Coast Light series, set to an original score.',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://picsum.photos/seed/video3/800/450',
        order: 3,
        createdAt: '2023-12-31T10:00:00Z',
      },
    ],
  })

  // ── Music ─────────────────────────────────────────────────────
  await seed('music/index.json', {
    tracks: [
      {
        id: 't1',
        title: 'Salt Flat (for piano)',
        fileUrl: '',
        artworkUrl: 'https://picsum.photos/seed/music1/400/400',
        duration: '4:32',
        order: 1,
        createdAt: '2024-10-01T10:00:00Z',
      },
      {
        id: 't2',
        title: 'Coastal Drift',
        fileUrl: '',
        artworkUrl: 'https://picsum.photos/seed/music2/400/400',
        duration: '6:14',
        order: 2,
        createdAt: '2024-07-15T10:00:00Z',
      },
      {
        id: 't3',
        title: 'Interior (Study in D)',
        fileUrl: '',
        artworkUrl: 'https://picsum.photos/seed/music3/400/400',
        duration: '3:58',
        order: 3,
        createdAt: '2024-04-20T10:00:00Z',
      },
      {
        id: 't4',
        title: 'Ember (Night Version)',
        fileUrl: '',
        artworkUrl: 'https://picsum.photos/seed/music4/400/400',
        duration: '5:07',
        order: 4,
        createdAt: '2023-11-10T10:00:00Z',
      },
    ],
  })

  // ── Shop ──────────────────────────────────────────────────────
  const products = [
    {
      slug: 'ocean-reverie-print',
      title: 'Ocean Reverie — Giclée Print',
      description: 'Archival giclée print on 310gsm Hahnemühle Photo Rag. Printed from the original file with full color accuracy. Available in two sizes: 40×50cm and 60×75cm.\n\nEach print is signed and numbered. Edition of 30.',
      price: 4800,
      images: [
        'https://picsum.photos/seed/print1a/800/1000',
        'https://picsum.photos/seed/print1b/800/1000',
      ],
      stock: 12,
      status: 'active' as const,
      createdAt: '2024-10-01T10:00:00Z',
    },
    {
      slug: 'ember-study-ii-print',
      title: 'Ember Study II — Giclée Print',
      description: 'Archival giclée print on 310gsm Hahnemühle Photo Rag. Rich warm tones, deep shadow detail. Signed and numbered. Edition of 25.',
      price: 5500,
      images: [
        'https://picsum.photos/seed/print2a/800/1000',
        'https://picsum.photos/seed/print2b/800/1000',
      ],
      stock: 8,
      status: 'active' as const,
      createdAt: '2024-09-15T10:00:00Z',
    },
    {
      slug: 'night-bloom-print',
      title: 'Night Bloom — Giclée Print',
      description: 'Archival print of the ink and gold botanical work. Printed on smooth fine art paper. The gold renders exceptionally. Edition of 20, signed.',
      price: 4200,
      images: [
        'https://picsum.photos/seed/print3a/800/1000',
      ],
      stock: 15,
      status: 'active' as const,
      createdAt: '2024-08-01T10:00:00Z',
    },
    {
      slug: 'coast-light-zine',
      title: 'Coast Light — Artist Zine',
      description: 'A 48-page perfect-bound zine collecting the Coast Light photography series. Offset printed on uncoated stock. Includes an introductory essay. 190×250mm.',
      price: 2800,
      images: [
        'https://picsum.photos/seed/zine1/800/600',
        'https://picsum.photos/seed/zine2/800/600',
      ],
      stock: 40,
      status: 'active' as const,
      createdAt: '2024-07-01T10:00:00Z',
    },
    {
      slug: 'drift-print',
      title: 'Drift — Giclée Print',
      description: 'Abstract field painting reproduced as archival giclée. The blue-grey tones and gestural marks carry well in print. 50×70cm. Edition of 20.',
      price: 5200,
      images: [
        'https://picsum.photos/seed/print4a/800/1000',
      ],
      stock: 6,
      status: 'active' as const,
      createdAt: '2024-06-10T10:00:00Z',
    },
  ]

  await seed('shop/index.json', {
    products: products.map(({ slug, title, price, images, stock, status }) => ({ slug, title, price, images, stock, status })),
  })
  for (const product of products) {
    await seed(`shop/${product.slug}.json`, product)
  }

  await seed('orders/index.json', { orders: [] })

  console.log('\n✅ Demo content seeded successfully.')
}

main().catch(console.error)
