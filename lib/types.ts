// lib/types.ts

export interface Artwork {
  slug: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  year: number
  order: number
  createdAt: string
}

export interface GalleryIndex {
  artworks: Pick<Artwork, 'slug' | 'title' | 'imageUrl' | 'tags' | 'order'>[]
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  status: 'published' | 'draft'
  tags: string[]
  createdAt: string
}

export interface PostIndex {
  posts: Pick<Post, 'slug' | 'title' | 'excerpt' | 'date' | 'status' | 'tags'>[]
}

export interface MusicSettings {
  soundcloudUrl: string
}

export interface Exhibition {
  order: number
  year: number
  title: string
  dateLabel: string
  venue: string
  city: string
  country: string
  format: string
  curator: string
  link: string
  image: string
}

export interface ExhibitionsIndex {
  exhibitions: Exhibition[]
}

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  featuredArtworkSlugs: string[]
  bioSnippet: string
}

export interface AboutContent {
  fullBio: string
  profilePhotoUrl: string
  instagram: string
  email: string
  whatsapp?: string
  linktree?: string
  twitter?: string
  linkedin?: string
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  metaImage: string
}

export interface Marketplace {
  title: string
  url: string
  domain: string
  description: string
  order: number
}

export interface MarketplacesIndex {
  marketplaces: Marketplace[]
}
