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
  title: string
  dateLabel: string
  year: number
  venue: string
  city: string
  country: string
  organizer: string
  role: string
  description: string
  sourcePage: number
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
